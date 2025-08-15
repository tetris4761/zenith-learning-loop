import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    console.log('Environment check:', {
      hasApiKey: !!OPENROUTER_API_KEY,
      keyLength: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0
    });
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      throw new Error('OPENROUTER_API_KEY is not set');
    }

    const { prompt, type, selectedText } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'explain':
        systemPrompt = 'You are a helpful AI assistant that explains concepts clearly and concisely. Break down complex ideas into understandable parts and provide practical examples when helpful.';
        userPrompt = `Please explain the following text in a clear and accessible way:\n\n"${selectedText}"\n\nAdditional context or question: ${prompt || 'No additional context provided.'}`;
        break;
      
      case 'summarize':
        systemPrompt = 'You are an expert at creating concise, informative summaries that capture the key points and main ideas of any text.';
        userPrompt = `Please provide a concise summary of the following document content:\n\n${selectedText}`;
        break;
      
      case 'improve':
        systemPrompt = 'You are a writing assistant that helps improve text clarity, style, and effectiveness while maintaining the original meaning and tone.';
        userPrompt = `Please improve the following text to make it clearer, more engaging, and better written:\n\n"${selectedText}"\n\nAdditional instructions: ${prompt || 'General improvement.'}`;
        break;
      
      case 'generate':
        systemPrompt = 'You are a creative writing assistant that helps generate content based on prompts and context.';
        userPrompt = `${prompt}\n\n${selectedText ? `Context: "${selectedText}"` : ''}`;
        break;
      
      default:
        systemPrompt = 'You are a helpful AI assistant.';
        userPrompt = prompt;
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zenith-docs.lovable.app',
        'X-Title': 'Zenith Documents'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenRouter API');
    }

    const result = data.choices[0].message.content;
    
    console.log('AI completion successful:', { type, resultLength: result.length });

    return new Response(JSON.stringify({ 
      result,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-completion function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});