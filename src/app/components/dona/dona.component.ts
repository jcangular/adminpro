import { Component, Input, OnInit } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';


@Component({
    selector: 'app-dona',
    templateUrl: './dona.component.html',
    styles: [
    ]
})
export class DonaComponent implements OnInit {

    @Input() title: string;

    @Input() lables: Label[] = [];

    @Input() data: MultiDataSet = [];

    @Input()
    public colors: Color[] = [
        { backgroundColor: ['#6857E6', '#009FEE', '#F02059', '#06D79C', '#56C0D8', '#EF5350'] }
    ];

    constructor() { }

    ngOnInit(): void {
    }

}
