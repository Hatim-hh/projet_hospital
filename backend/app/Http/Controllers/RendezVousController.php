<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use App\Models\Patient;
use App\Models\Medecin;
use Illuminate\Http\Request;

class RendezVousController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = RendezVous::with(['patient', 'medecin']);

            // Filter by patient
            if ($request->has('id_patient')) {
                $query->where('id_patient', $request->id_patient);
            }

            // Filter by medecin
            if ($request->has('id_medecin')) {
                $query->where('id_medecin', $request->id_medecin);
            }

            // Filter by status
            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }

            // Search by patient name or doctor name
            if ($request->has('search')) {
                $search = $request->search;
                $query->whereHas('patient', function($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%");
                })->orWhereHas('medecin', function($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%");
                });
            }

            $rendezVous = $query->orderBy('date_heure', 'asc')->get();

            // Transform the data for frontend
            $data = $rendezVous->map(function($rdv) {
                return $this->formatRendezVous($rdv);
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient' => 'required|string',
            'doctor' => 'required|string',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'status' => 'required|in:Confirmé,En attente,Annulé',
            'notes' => 'nullable|string'
        ]);

        try {
            // Parse patient and doctor names
            $patientName = $validated['patient'];
            $doctorName = str_replace('Dr. ', '', $validated['doctor']);

            // Find or create patient by name
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

            // Create rendez-vous
            $dateTime = $validated['date'] . ' ' . $validated['time'] . ':00';
            $rdv = RendezVous::create([
                'id_patient' => $patient->id_patient,
                'id_medecin' => $medecin->id_medecin,
                'date_heure' => $dateTime,
                'statut' => strtolower(str_replace('Confirmé', 'confirme', str_replace('En attente', 'en_attente', str_replace('Annulé', 'annule', $validated['status'])))),
                'motif' => $validated['notes'] ?? null,
                'duree_minutes' => 30
            ]);

            return response()->json($this->formatRendezVous($rdv->load(['patient', 'medecin'])), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $rdv = RendezVous::with(['patient', 'medecin'])->findOrFail($id);
        return response()->json($this->formatRendezVous($rdv));
    }

    public function update(Request $request, $id)
    {
        $rdv = RendezVous::findOrFail($id);

        $validated = $request->validate([
            'patient' => 'often|string',
            'doctor' => 'often|string',
            'date' => 'often|date',
            'time' => 'often|date_format:H:i',
            'status' => 'often|in:Confirmé,En attente,Annulé',
            'notes' => 'nullable|string'
        ]);

        try {
            if (isset($validated['date']) && isset($validated['time'])) {
                $dateTime = $validated['date'] . ' ' . $validated['time'] . ':00';
                $rdv->date_heure = $dateTime;
            }

            if (isset($validated['status'])) {
                $rdv->statut = strtolower(str_replace('Confirmé', 'confirme', str_replace('En attente', 'en_attente', str_replace('Annulé', 'annule', $validated['status']))));
            }

            if (isset($validated['notes'])) {
                $rdv->motif = $validated['notes'];
            }

            $rdv->save();

            return response()->json($this->formatRendezVous($rdv->load(['patient', 'medecin'])));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $rdv = RendezVous::findOrFail($id);
        $rdv->delete();
        return response()->json(['message' => 'Rendez-vous supprimé']);
    }

    private function formatRendezVous($rdv)
    {
        return [
            'id' => $rdv->id_rdv,
            'patient' => $rdv->patient->prenom . ' ' . $rdv->patient->nom,
            'doctor' => 'Dr. ' . $rdv->medecin->prenom . ' ' . $rdv->medecin->nom,
            'date' => $rdv->date_heure->format('Y-m-d'),
            'time' => $rdv->date_heure->format('H:i'),
            'status' => $this->mapStatus($rdv->statut),
            'notes' => $rdv->motif,
            'motif' => $rdv->motif,
            'duree_minutes' => $rdv->duree_minutes
        ];
    }

    private function mapStatus($status)
    {
        $map = [
            'confirme' => 'Confirmé',
            'en_attente' => 'En attente',
            'annule' => 'Annulé',
            'termine' => 'Terminé'
        ];
        return $map[$status] ?? ucfirst($status);
    }
}
