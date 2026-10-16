import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, CustomEase);

/* the "by hand" ease used for slow paper moves */
CustomEase.create('hand', 'M0,0 C0.19,0.01 0.16,0.55 0.32,0.74 C0.45,0.89 0.61,0.96 0.77,0.99 C0.88,1 0.94,1 1,1');
CustomEase.create('silk', 'M0,0 C0.12,0.06 0.14,0.4 0.28,0.62 C0.4,0.8 0.55,0.93 0.72,0.98 C0.85,1 0.94,1 1,1');

export { gsap, ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, CustomEase };
