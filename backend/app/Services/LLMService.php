<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LLMService
{
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl;
    

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key', env('GEMINI_API_KEY'));
        $this->model = config('services.gemini.model', env('GEMINI_MODEL', 'gemini-flash-latest'));
        // URL officielle de l'API Gemini v1beta
        $this->baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";
    }

    /**
     * Envoie un prompt au LLM Gemini et retourne sa réponse textuelle.
     * * @param string $prompt Le message ou l'instruction textuelle
     * @return string|null La réponse du LLM ou null en cas d'erreur
     */
    public function genererTexte(string $prompt): ?string
    {
        try {
            // Construction de la requête selon les spécifications de l'API Google Gemini
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}?key={$this->apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                // On peut ajouter des paramètres de configuration optionnels
                'generationConfig' => [
                    'temperature' => 0.1, // Basse température pour des réponses stables et déterministes
                    'responseMimeType' => 'application/json',
                    'maxOutputTokens' => 1000,
                ]
            ]);

            if ($response->failed()) {
                Log::error("Erreur API Gemini : " . $response->body());
                return null;
            }

            // Extraction de la réponse textuelle du JSON de Gemini
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

        } catch (\Exception $e) {
            Log::error("Exception levée dans LLMService : " . $e->getMessage());
            return null;
        }
    }
}