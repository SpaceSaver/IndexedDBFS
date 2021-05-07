class iDBFS {
    constructor(name, mode) {
        this.FSName = name;
        switch (mode) {
            case 0:
                this.writable = false;
                break;
            case 1:
                this.writable = true;
                break;
            default:
                this.writable = true;
                break;
        }
        let request = window.indexedDB.open("dataDB", 1),
            db,
            tx,
            store,
            index;
        request.onupgradeneeded = e => {
            let db = request.result,
                store = db.createObjectStore("dataStore", { autoIncrement: true }),
                index = store.createIndex("parent", "parent", { unique: false, multiEntry: true });
        }
        request.onerror = e => {
            console.log("The following error occurred while priming indexedDB:");
            console.log(e);
            console.log("IndexedDB will not be used.");
        }
        request.onsuccess = async e => {
            db = request.result;
            tx = db.transaction("dataStore", "readwrite");
            store = tx.objectStore("dataStore");
            index = store.index("parent");
            var wholeitem;
            var zip = new JSZip();
            var thelisttemp = thelist;
            for (const itemname in thelisttemp) {
                wholeitem = await promiseReq(store.get(parseInt(thelisttemp[itemname])));
                zip.file(wholeitem.filename, wholeitem.data.substring(22), { base64: true });
                store.delete(parseInt(thelisttemp[itemname]));
                delete thelist[itemname]
            }
            thelisttemp = undefined;
            zip.generateAsync({ type: "blob" }).then(content => {
                downloads.download = filename + ".zip";
                console.log(URL.createObjectURL(content));
                downloads.href = URL.createObjectURL(content);
                downloads.click();
            });
        }
    }
}