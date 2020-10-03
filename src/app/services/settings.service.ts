import { not } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ThemeService } from 'ng2-charts';

export type Theme = 'default' | 'green' | 'red' | 'blue' | 'purple' | 'megna';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private linkTheme: HTMLLinkElement = document.getElementById('theme') as HTMLLinkElement;
    private darkMode: boolean;
    private themeColor: Theme = 'default';

    constructor() {
        this.themeColor = this.checkTheme(localStorage.getItem('themeColor'));
        this.darkMode = (localStorage.getItem('darkMode') === 'true' ? true : false);
        // console.log(`SettingsService: dark mode [${this.darkMode}]`);
        this.loadTheme();
    }

    get theme(): string {
        return this.themeColor;
    }

    setTheme(theme: Theme): void {
        this.themeColor = this.checkTheme(theme);
        this.changeTheme();
    }

    get isDarkMode(): boolean {
        return this.darkMode;
    }

    setDarkMode(darkMode: boolean): void {
        this.darkMode = darkMode;
        this.changeTheme();
    }

    get refTheme(): string {
        return `./assets/css/colors/${this.theme}${this.darkMode ? '-dark' : ''}.css`;
    }


    /**
     * Carga el tema de la aplicación.
     */
    private loadTheme(): void {
        this.linkTheme.setAttribute('href', this.refTheme);
    }

    private changeTheme(): void {
        this.linkTheme.setAttribute('href', this.refTheme);
        localStorage.setItem('themeColor', this.theme);
        localStorage.setItem('darkMode', `${this.darkMode}`);
    }

    public checkCurrentTheme(links: NodeListOf<HTMLAnchorElement>): void {
        links.forEach(el => {
            if (el.getAttribute('data-theme') === this.themeColor) {
                el.classList.add('working');
            } else {
                el.classList.remove('working');
            }
        });
    }

    public isRed(): boolean {
        return this.themeColor === 'red';
    }

    private checkTheme(theme: string | Theme): Theme {
        switch (theme) {
            case 'green':
            case 'red':
            case 'blue':
            case 'purple':
            case 'megna':
                return theme as Theme;
            default:
                return 'default';
        }
    }
}
