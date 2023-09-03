#ifdef GL_ES
    #define LOWP lowp
    precision mediump float;
#else
    #define LOWP
#endif

uniform vec2        resolution;           // viewport resolution (in pixels)
uniform float       time;
varying LOWP vec4   v_color;
varying vec2        v_texCoords;
uniform sampler2D   u_texture;

float random (in vec2 st) {return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.545);}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(st);
        st = rot * st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main()
{
    vec2 st = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;

    vec3 color = vec3(0.0);

        vec2 q = vec2(0.);
        q.x = fbm( st + 0.00*time);
        q.y = fbm( st + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time );
        r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);

        float f = fbm(st+r);

        color = mix(vec3(0.101961,0.619608,0.666667),
                    vec3(0.666667,0.666667,0.498039),
                    clamp((f*f)*4.0,0.0,1.0));

        color = mix(color,
                    vec3(0,0,0.164706),
                    clamp(length(q),0.0,1.0));

        color = mix(color,
                    vec3(0.666667,1,1),
                    clamp(length(r.x),0.0,1.0));

        gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
        //gl_FragColor = v_color * texture2D(u_texture, v_texCoords) * vec4((f*f*f+.6*f*f+.5*f)*color,1.);// итоговый цвет пикселя

}