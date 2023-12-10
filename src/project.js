export class Project {
  constructor(name, data) {
    this.name = name;
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
