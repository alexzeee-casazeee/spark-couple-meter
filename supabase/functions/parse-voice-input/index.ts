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
    const { text, customDimensions = [] } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Parsing voice input:', text, 'Custom dimensions:', customDimensions);

    // Build system prompt with custom dimensions
    let systemPrompt = `You are a parser that extracts emotional metrics from natural language. 
Extract values from 0-100 for: horniness_level, general_feeling, sleep_quality, emotional_state.`;

    if (customDimensions.length > 0) {
      systemPrompt += `\n\nAlso extract values (0-100) for these custom dimensions: ${customDimensions.join(', ')}.
Pay close attention to mentions of these specific dimensions in the user's message and adjust their values accordingly.
For example:
- "I have more energy" or "feeling energetic" -> increase Energy value significantly (70-90)
- "low energy" or "tired" -> decrease Energy value (10-30)
- "stressed out" -> increase Stress value (70-90)
- "relaxed" or "calm" -> decrease Stress value (10-30)`;
    }

    systemPrompt += `\n\nExamples:
"I'm feeling really great today, slept amazing, feeling very connected and emotionally high" -> {"horniness_level": 80, "general_feeling": 90, "sleep_quality": 95, "emotional_state": 85}
"Not great, barely slept, feeling low and not in the mood" -> {"horniness_level": 20, "general_feeling": 30, "sleep_quality": 25, "emotional_state": 30}
"I'm horny as hell today" -> {"horniness_level": 95, "general_feeling": 70, "sleep_quality": 70, "emotional_state": 70}

If a value is not mentioned, estimate based on context or use 50 as default.`;

    // Build tool parameters with custom dimensions
    const toolParameters: any = {
      type: "object",
      properties: {
        horniness_level: { 
          type: "number",
          description: "Intimacy/desire level from 0-100"
        },
        general_feeling: { 
          type: "number",
          description: "Overall mood/feeling from 0-100"
        },
        sleep_quality: { 
          type: "number",
          description: "Quality of sleep from 0-100"
        },
        emotional_state: { 
          type: "number",
          description: "Emotional wellbeing from 0-100"
        }
      },
      required: ["horniness_level", "general_feeling", "sleep_quality", "emotional_state"]
    };

    // Add custom dimensions to tool parameters
    if (customDimensions.length > 0) {
      customDimensions.forEach((dim: string) => {
        toolParameters.properties[dim] = {
          type: "number",
          description: `${dim} level from 0-100`
        };
      });
    }

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_daily_metrics",
              description: "Set the daily emotional and intimacy metrics",
              parameters: toolParameters
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
      
      // Separate standard metrics from custom dimensions
      const standardMetrics = {
        horniness_level: parsedData.horniness_level,
        general_feeling: parsedData.general_feeling,
        sleep_quality: parsedData.sleep_quality,
        emotional_state: parsedData.emotional_state
      };
      
      const customDimensionValues: Record<string, number> = {};
      customDimensions.forEach((dim: string) => {
        if (parsedData[dim] !== undefined) {
          customDimensionValues[dim] = parsedData[dim];
        }
      });
      
      const response = {
        ...standardMetrics,
        custom_dimensions: customDimensionValues
      };
      
      console.log('Parsed response:', JSON.stringify(response));
      
      return new Response(JSON.stringify(response), {
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
