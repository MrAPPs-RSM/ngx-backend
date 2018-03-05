import {Cell} from './cell';
import {Column} from './column';
import {DataSet} from './data-set';

export class Row {

    isSelected: boolean = false;
    isInEditing: boolean = false;
    cells: Array<Cell> = [];


    constructor(public index: number, protected data: any, protected _dataSet: DataSet) {
        this.process();
    }

    getCell(column: Column): Cell {
        return this.cells.find(el => el.getColumn() === column);
    }

    getCells() {
        return this.cells;
    }

    getData(): any {
        return this.data;
    }

    getIsSelected(): boolean {
        return this.isSelected;
    }

    getNewData(): any {
        const values = Object.assign({}, this.data);
        this.getCells().forEach((cell) => values[cell.getColumn().id] = cell.newValue);
        return values;
    }

    setData(data: any): any {
        this.data = data;
        this.process();
    }

    process() {
        this.cells = [];
        this._dataSet.getVisibleColumns().forEach((column: Column) => {
            const cell = this.createCell(column);
            this.cells.push(cell);
        });
    }

    createCell(column: Column): Cell {
        const defValue = (column as any).settings.defaultValue ? (column as any).settings.defaultValue : '';

        let value = defValue;
        /**
         * Support for sub-properties
         */
        if (column.id.indexOf('.') !== -1) {
            const baseField = column.id.split('.')[0];
            const subField = column.id.split('.')[1];

            if (this.data[baseField] instanceof Object && this.data[baseField].hasOwnProperty(subField)) {
                value = this.data[baseField][subField];
            }
        } else {
            value = typeof this.data[column.id] === 'undefined' ? defValue : this.data[column.id];
        }

        return new Cell(value, this, column, this._dataSet);
    }
}
