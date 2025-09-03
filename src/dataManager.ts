let instance: DataManager;

interface DataEntry {
    header: string;
    body: string;
    tint: string;
}

export default class DataManager {
    protected _data: {[key: string]: DataEntry};

    public get length() {
        return Object.keys(this._data).length;
    }

    public get keys() {
        return Object.keys(this._data);
    }

    public getData(key: string) {
        return this._data[key]
    }

    constructor() {
        if (instance) return instance;
        instance = this;
    }

    public async loadData() {
        const data = await fetch("/data/entries.json");
        this._data = await data.json();
    }
}