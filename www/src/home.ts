import { BreadcrumbsComponent } from "./breadcrumbs";
import { ContactInfo } from "./footer";
import { DynamicComponent } from "./lib/component";
import { OverviewComponent } from "./node/overview";
import { html } from "./lib/template";

export class HomeComponent extends DynamicComponent {
  private contactInformation: ContactInfo;
  private breadcrumbsComponent: BreadcrumbsComponent;
  private overviewComponent: OverviewComponent;

  constructor(contactInformation: ContactInfo) {
    super();

    this.contactInformation = contactInformation;
    this.breadcrumbsComponent = new BreadcrumbsComponent([], "Home");
    this.overviewComponent = new OverviewComponent();
  }

  public init(): void {
    this.breadcrumbsComponent.init();
    this.overviewComponent.init();

    this.overviewComponent.listen(() => {
      this.render();
    });
  }

  public view(): string {
    const breadcrumbsComponent = this.breadcrumbsComponent;
    const overviewComponent = this.overviewComponent;
    const contactInformation = this.contactInformation;

    return html`
      ${breadcrumbsComponent.view()}
      <section>
        <h1>${contactInformation.title}</h1>
        <p>
        This node is part of ${contactInformation.title} in
        ${contactInformation.city}, ${contactInformation.country}.
        </p>
      </section>
      <section>
        <h3>Overview</h1>
        ${overviewComponent.view()}
      </section>
    `;
  }
}
