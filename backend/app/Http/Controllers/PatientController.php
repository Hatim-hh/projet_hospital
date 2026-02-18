<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\DossierMedical;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::with(['dossierMedical']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('numero_dossier', 'like', "%{$search}%");
            });
        }

        $patients = $query->orderBy('created_at', 'desc')->get();
        return response()->json($patients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'date_naissance' => 'required|date',
            'sexe' => 'required|in:M,F',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'email' => 'nullable|email',
            'groupe_sanguin' => 'nullable|string',
            'situation_familiale' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $dernierPatient = Patient::orderBy('id_patient', 'desc')->first();
            $numeroSuivant = $dernierPatient ? intval(substr($dernierPatient->numero_dossier, 1)) + 1 : 4;
            $validated['numero_dossier'] = 'P' . str_pad($numeroSuivant, 6, '0', STR_PAD_LEFT);

            $patient = Patient::create($validated);
            DossierMedical::create(['id_patient' => $patient->id_patient]);

            DB::commit();
            return response()->json($patient->load('dossierMedical'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur création patient'], 500);
        }
    }

    public function show($id)
    {
        $patient = Patient::with(['dossierMedical'])->findOrFail($id);
        return response()->json($patient);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->update($request->all());
        return response()->json($patient);
    }

    public function destroy($id)
    {
        Patient::findOrFail($id)->delete();
        return response()->json(['message' => 'Patient supprimé']);
    }
}
