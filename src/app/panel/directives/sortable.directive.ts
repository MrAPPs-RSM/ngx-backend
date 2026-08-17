import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[appSortable]',
  standalone: true
})
export class SortableDirective implements AfterViewInit, OnDestroy {
  @Input('appSortable') items: any[] = [];
  @Input() dragHandle = '.drag';
  @Output() sorted = new EventEmitter<any[]>();

  private sourceIndex = -1;
  private handleActive = false;
  private observer?: MutationObserver;
  private cleanups: Array<() => void> = [];

  constructor(private element: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.refreshChildren();
    this.observer = new MutationObserver(() => this.refreshChildren());
    this.observer.observe(this.element.nativeElement, {childList: true});
    this.cleanups.push(
      this.renderer.listen(this.element.nativeElement, 'mousedown', (event: MouseEvent) => {
        this.handleActive = !!(event.target as HTMLElement).closest(this.dragHandle);
      }),
      this.renderer.listen(this.element.nativeElement, 'dragstart', (event: DragEvent) => this.onDragStart(event)),
      this.renderer.listen(this.element.nativeElement, 'dragover', (event: DragEvent) => event.preventDefault()),
      this.renderer.listen(this.element.nativeElement, 'drop', (event: DragEvent) => this.onDrop(event)),
      this.renderer.listen(this.element.nativeElement, 'dragend', () => this.reset())
    );
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.cleanups.forEach(cleanup => cleanup());
  }

  private refreshChildren(): void {
    Array.from(this.element.nativeElement.children).forEach(child => {
      this.renderer.setAttribute(child, 'draggable', 'true');
    });
  }

  private onDragStart(event: DragEvent): void {
    if (!this.handleActive) {
      event.preventDefault();
      return;
    }
    const child = this.directChild(event.target as HTMLElement);
    this.sourceIndex = child ? Array.from(this.element.nativeElement.children).indexOf(child) : -1;
    event.dataTransfer?.setData('text/plain', String(this.sourceIndex));
  }

  private onDrop(event: DragEvent): void {
    event.preventDefault();
    const child = this.directChild(event.target as HTMLElement);
    const targetIndex = child ? Array.from(this.element.nativeElement.children).indexOf(child) : this.items.length - 1;
    if (this.sourceIndex >= 0 && targetIndex >= 0 && this.sourceIndex !== targetIndex) {
      const [item] = this.items.splice(this.sourceIndex, 1);
      this.items.splice(targetIndex, 0, item);
      this.sorted.emit(this.items);
    }
    this.reset();
  }

  private directChild(target: HTMLElement): Element | null {
    let current: Element | null = target;
    while (current && current.parentElement !== this.element.nativeElement) {
      current = current.parentElement;
    }
    return current;
  }

  private reset(): void {
    this.sourceIndex = -1;
    this.handleActive = false;
  }
}
