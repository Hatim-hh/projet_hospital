<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Patient;
use App\Models\Medecin;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Consultation::with(['patient', 'medecin']);

            // Filter by patient
            if ($request->has('id_patient')) {
                $query->where('id_patient', $request->id_patient);
            }

            // Filter by medecin
            if ($request->has('id_medecin')) {
                $query->where('id_medecin', $request->id_medecin);
            }

            // Search by patient name, doctor name or diagnosis
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->whereHas('patient', function($subQ) use ($search) {
                        $subQ->where('nom', 'like', "%{$search}%")
                             ->orWhere('prenom', 'like', "%{$search}%");
                    })->orWhereHas('medecin', function($subQ) use ($search) {
                        $subQ->where('nom', 'like', "%{$search}%")
                             ->orWhere('prenom', 'like', "%{$search}%");
                    })->orWhere('diagnostic', 'like', "%{$search}%")
                      ->orWhere('motif', 'like', "%{$search}%");
                });
            }

            $consultations = $query->orderBy('date_consultation', 'desc')->get();

            // Transform the data for frontend
            $data = $consultations->map(function($cons) {
                return $this->formatConsultation($cons);
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient' => 'required|string',
            'doctor' => 'required|string',
            'date' => 'required|date',
            'diagnosis' => 'required|string',
            'notes' => 'nullable|string',
            'priority' => 'nullable|in:Normale,Importante,Urgente'
        ]);

        try {
            // Parse patient and doctor names
            $patientName = $validated['patient'];
            $doctorName = str_replace('Dr. ', '', $validated['doctor']);

            // Find patient
            $patient = Patient::whereRaw("CONCAT(prenom, ' ', nom) = ?", [$patientName])
                ->orWhereRaw("CONCAT(nom, ' ', prenom) = ?", [$patientName])
                ->first();

            if (!$patient) {
                return response()->json(['error' => 'Patient non trouvé'], 404);
            }

            // Find doctor
            $medecin = Medecin::whereRaw("CONCAT(prenom, ' ', nom) = ?", [$doctorName])
                ->orWhereRaw("CONCAT(nom, ' ', prenom) = ?", [$doctorName])
                ->first();

            if (!$medecin) {
                return response()->json(['error' => 'Médecin non trouvé'], 404);
            }

            // Create consultation
            $consultation = Consultation::create([
                'id_patient' => $patient->id_patient,
                'id_medecin' => $medecin->id_medecin,
                'date_consultation' => $validated['date'] . ' ' . date('H:i:s'),
                'diagnostic' => $validated['diagnosis'],
                'observations' => $validated['notes'] ?? null,
                'motif' => $validated['diagnosis']
            ]);

            return response()->json($this->formatConsultation($consultation->load(['patient', 'medecin'])), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $consultation = Consultation::with(['patient', 'medecin'])->findOrFail($id);
        return response()->json($this->formatConsultation($consultation));
    }

    public function update(Request $request, $id)
    {
        $consultation = Consultation::findOrFail($id);

        $validated = $request->validate([
            'patient' => 'often|string',
            'doctor' => 'often|string',
            'date' => 'often|date',
            'diagnosis' => 'often|string',
            'notes' => 'nullable|string',
            'priority' => 'nullable|in:Normale,Importante,Urgente'
        ]);

        try {
            if (isset($validated['date'])) {
                $consultation->date_consultation = $validated['date'] . ' ' . $consultation->date_consultation->format('H:i:s');
            }

            if (isset($validated['diagnosis'])) {
                $consultation->diagnostic = $validated['diagnosis'];
                $consultation->motif = $validated['diagnosis'];
            }

            if (isset($validated['notes'])) {
                $consultation->observations = $validated['notes'];
            }

            $consultation->save();

            return response()->json($this->formatConsultation($consultation->load(['patient', 'medecin'])));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $consultation = Consultation::findOrFail($id);
        $consultation->delete();
        return response()->json(['message' => 'Consultation supprimée']);
    }

    private function formatConsultation($consultation)
    {
        return [
            'id' => $consultation->id_consultation,
            'patient' => $consultation->patient->prenom . ' ' . $consultation->patient->nom,
            'doctor' => 'Dr. ' . $consultation->medecin->prenom . ' ' . $consultation->medecin->nom,
            'date' => $consultation->date_consultation->format('Y-m-d'),
            'diagnosis' => $consultation->diagnostic ?? $consultation->motif ?? 'Consultation',
            'notes' => $consultation->observations,
            'priority' => $this->determinePriority($consultation),
            'examen_clinique' => $consultation->examen_clinique,
            'poids' => $consultation->poids,
            'tension' => $consultation->tension,
            'temperature' => $consultation->temperature
        ];
    }

    private function determinePriority($consultation)
    {
        // Determine priority based on diagnosis keywords
        $diagnostic = strtolower($consultation->diagnostic ?? '');
        $observations = strtolower($consultation->observations ?? '');
        $motif = strtolower($consultation->motif ?? '');
        $full = $diagnostic . ' ' . $observations . ' ' . $motif;

        $urgentKeywords = ['urgent', 'urgence', 'grave', 'critique', 'douleur', 'saignement', 'inconscient'];
        $importantKeywords = ['suivi', 'post-opératoire', 'hospitalisation', 'traitement urgence'];

        foreach ($urgentKeywords as $keyword) {
            if (strpos($full, $keyword) !== false) {
                return 'Urgente';
            }
        }

        foreach ($importantKeywords as $keyword) {
            if (strpos($full, $keyword) !== false) {
                return 'Importante';
            }
        }

        return 'Normale';
    }
}
