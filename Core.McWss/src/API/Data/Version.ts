export class Version {
  public Major: number = 0;
  public Minor: number = 0;
  public Build: number = 0;

  constructor(major: number, minor: number, build: number) {
    this.Major = major;
    this.Minor = minor;
    this.Build = build;
  }
}
