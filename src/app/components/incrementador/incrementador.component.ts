import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-incrementador',
    templateUrl: './incrementador.component.html',
    styles: [
    ]
})
export class IncrementadorComponent implements OnInit {

    @Input('valor') progreso = 50;
    @Input() btnClass = 'btn-primary';

    @Output() valor: EventEmitter<number> = new EventEmitter();

    ngOnInit(): void {
        this.btnClass = `btn ${this.btnClass}`;
    }

    changeValue(valor: number): void {
        this.progreso = Math.min(Math.max(0, this.progreso + valor), 100);
        this.valor.emit(this.progreso);
    }

    onChange(valor: number): void {
        this.progreso = Math.min(Math.max(0, valor), 100);
        this.valor.emit(this.progreso);
    }
}
