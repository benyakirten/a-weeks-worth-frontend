import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger
} from "@angular/animations";

export const slideUpFade = (identifier: string) => (
  trigger(identifier, [
    state('visible', style({
      opacity: 1,
      height: '*',
      'transform-origin': 'top',
      transform: 'scaleY(1)',
    })),
    state('void', style({
      opacity: 0,
      height: 0,
      'transform-origin': 'top',
      transform: 'scaleY(0)',
    })),
    transition('* <=> void', animate('800ms ease'))
  ])
);

export const moveRightFade = (identifier: string) => (
  trigger(identifier, [
    state('present', style({
      transform: 'translateX(0)',
      opacity: 1
    })),
    state('void', style({
      transform: 'translateX(100%)',
      opacity: 0
    })),
    transition('* <=> void', animate('1200ms ease'))
  ])
);

export const moveLeftFade = (identifier: string) => (
  trigger(identifier, [
    state('present', style({
      transform: 'translateX(0)',
      opacity: 1
    })),
    state('void', style({
      transform: 'translateX(-100%)',
      opacity: 0
    })),
    transition('* <=> void', animate('600ms ease'))
  ])
);

export const moveDownFade = (identifier: string) => (
  trigger(identifier, [
    state('present', style({
      transform: 'translateY(0)',
      opacity: 1
    })),
    state('void', style({
      transform: 'translateY(-100%)',
      opacity: 0
    })),
    transition('void => *', animate('800ms ease-in')),
    transition('* => void', animate('800ms ease-out'))
  ])
);

export const expandFromCenter = (identifier: string) => (
  trigger(identifier, [
    state('present', style({
      transform: 'scale(1)',
      opacity: 1
    })),
    state('void', style({
      transform: 'scale(0.2)',
      opacity: 0.8
    })),
    transition(`void => *`, animate('800ms ease-in')),
    transition(`* => void`, animate('800ms ease-out'))
  ])
);

export const simpleFade = (identifier: string) => (
  trigger(identifier, [
    state('present', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    transition(`* <=> void`, animate('800ms ease'))
  ])
);

export const simpleFadeOutIn = (identifier: string) => (
  trigger(identifier, [
    transition('* <=> void', [
      query(':leave', [
        stagger(100, [
          animate('0.5s', style({ opacity: 0 }))
        ])
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        stagger(100, [
          animate('0.5s', style({ opacity: 1 }))
        ])
      ], { optional: true })
    ])
  ])
);
