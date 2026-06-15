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


    public function genererJson(string $prompt): ?string
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->retry(3, 200) // Retry up to 3 times, with a 200ms delay between attempts if it fails
            ->timeout(60)   
            ->post("{$this->baseUrl}?key={$this->apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
               
                'generationConfig' => [
                    'temperature' => 0.1, 
                    'responseMimeType' => 'application/json',
                    'maxOutputTokens' => 2000,
                ]
            ]);

            if ($response->failed()) {
                Log::error("Erreur API Gemini : " . $response->body());
                return null;
            }

            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

        } catch (\Exception $e) {
            Log::error("Exception levée dans LLMService : " . $e->getMessage());
            return null;
        }
    }
}