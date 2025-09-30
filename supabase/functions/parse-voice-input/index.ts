import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Parsing voice input:', text);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a parser that extracts emotional metrics from natural language. 
            Extract values from 0-100 for: horniness_level, general_feeling, sleep_quality, emotional_state.
            Return ONLY valid JSON in this exact format: {"horniness_level": 0-100, "general_feeling": 0-100, "sleep_quality": 0-100, "emotional_state": 0-100}
            
            Examples:
            "I'm feeling really great today, slept amazing, feeling very connected and emotionally high" -> {"horniness_level": 80, "general_feeling": 90, "sleep_quality": 95, "emotional_state": 85}
            "Not great, barely slept, feeling low and not in the mood" -> {"horniness_level": 20, "general_feeling": 30, "sleep_quality": 25, "emotional_state": 30}
            "I'm horny as hell today" -> {"horniness_level": 95, "general_feeling": 70, "sleep_quality": 70, "emotional_state": 70}
            
            If a value is not mentioned, estimate based on context or use 50 as default.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        tools: [
          {
            type: "function",
            name: "set_daily_metrics",
            description: "Set the daily emotional and intimacy metrics",
            parameters: {
              type: "object",
              properties: {
                horniness_level: { 
                  type: "number",
                  description: "Intimacy/desire level from 0-100",
                  minimum: 0,
                  maximum: 100
                },
                general_feeling: { 
                  type: "number",
                  description: "Overall mood/feeling from 0-100",
                  minimum: 0,
                  maximum: 100
                },
                sleep_quality: { 
                  type: "number",
                  description: "Quality of sleep from 0-100",
                  minimum: 0,
                  maximum: 100
                },
                emotional_state: { 
                  type: "number",
                  description: "Emotional wellbeing from 0-100",
                  minimum: 0,
                  maximum: 100
                }
              },
              required: ["horniness_level", "general_feeling", "sleep_quality", "emotional_state"],
              additionalProperties: false
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "set_daily_metrics" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));

    // Extract tool call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsedData = JSON.parse(toolCall.function.arguments);
      
      return new Response(JSON.stringify(parsedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('No valid tool call in response');

  } catch (error) {
    console.error('Error in parse-voice-input:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
