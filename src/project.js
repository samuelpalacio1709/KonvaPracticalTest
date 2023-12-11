export class Project {
  constructor(name, size, data) {
    this.name = name;
    this.date = "2022-05-15";
    this.size = size;
    this.data = data;
  }

  downloadURI(uri) {
    var link = document.createElement("a");
    link.download = this.name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
