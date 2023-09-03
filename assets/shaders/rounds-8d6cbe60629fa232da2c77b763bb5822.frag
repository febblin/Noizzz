#ifdef GL_ES
    #define LOWP lowp
    precision mediump float;
#else
    #define LOWP
#endif
varying LOWP vec4 v_color;
varying vec2 v_texCoords;
uniform sampler2D u_texture;
uniform vec2 resolution;
uniform float time;

vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos( 6.28318 * (c * t + d));
}

vec3 palette_a( float t) {
    return palette(t, vec3(.5,.5,.5), vec3(.5,.5,.5), vec3(1.,1.,1.), vec3(.263,.416,.557));
}

void main(){
    vec2 uv = gl_FragCoord.xy  / resolution;
    uv -= .5;
    uv *= 2.0;
    uv.x *= resolution.x / resolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(.0);

    for (float i = .0; i< 4.; i++){
        uv = fract(uv) - .5;
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette_a(length(uv0) + i*.4 + time*.4);
        d = sin(d * 9. + time) / 12.;
        d = abs(d);
        d = pow(.015 / d, 1.2);
        finalColor += col * d;
    }

    gl_FragColor = vec4(finalColor,1.);
    //gl_FragColor = v_color * texture2D(u_texture, v_texCoords) * vec4(finalColor, 1.);// итоговый цвет пикселя
}