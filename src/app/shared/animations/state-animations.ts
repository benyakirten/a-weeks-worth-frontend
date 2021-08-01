import { trigger, state, style, transition, animate } from "@angular/animations"

export const slideUpFade = (
  identifier: string,
  normalState: string,
  finalState: string
) => (
  trigger(identifier, [
    state(normalState, style({
      transform: 'scaleY(1)',
      opacity: 1,
      'transform-origin': 'top'
    })),
    state(finalState, style({
      transform: 'scaleY(0)',
      height: '0',
      opacity: 0.2,
      'transform-origin': 'top'
    })),
    transition(`${normalState} <=> ${finalState}`, animate('800ms ease'))
  ])
)
