import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
} from '@angular/core';
import { OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightCard]',
})
export class HighlightCardDirective implements OnChanges {
  @Input() externalColor: string = 'red';
  @Input('appHighlightCard') defaultColor: string = 'gray';
  constructor(private ele: ElementRef) {}
  ngOnChanges(): void {
    this.ele.nativeElement.style.backgroundColor = this.defaultColor;
  }
  @HostListener('mouseover') over() {
    this.ele.nativeElement.style.backgroundColor = this.externalColor;
  }

  @HostListener('mouseout') out() {
    this.ele.nativeElement.style.backgroundColor = this.defaultColor;
  }
}
