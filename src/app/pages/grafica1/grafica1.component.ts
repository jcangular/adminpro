import { Component } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

interface Grafica {
    label: Label;
    data: MultiDataSet;
}
@Component({
    selector: 'app-grafica1',
    templateUrl: './grafica1.component.html',
    styles: [
    ]
})
export class Grafica1Component {

    ventas: Grafica = {
        label: ['SPS', 'TGU', 'CBA'],
        data: [[350, 450, 100]]
    };

    productos: Grafica = {
        label: ['Recargas', 'Paquetigos', 'Super Recargas', 'Prestamitos', 'Residencial'],
        data: [[50, 25, 275, 75, 120]]
    };

    tecnologias: Grafica = {
        label: ['3G', '4G'],
        data: [[233, 784]]
    };

    consolas: Grafica = {
        label: ['PS5', 'XBox Serie X', 'Switch'],
        data: [[499, 499, 420]]
    };

}
