import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [NgForOf],
  template: `
    <div class="loading" *ngFor="let line of lines">
      <div class="bar"></div>
    </div>
  `,
  styles: [
    `
      @keyframes loading {
        40% {
          background-position: 100% 0;
        }
        100% {
          background-position: 100% 0;
        }
      }

      .loading {
        position: relative;
        margin: 1em 0;

        .bar {
          background-color: #e7e7e7;
          height: 14px;
          border-radius: 7px;
          width: 80%;
        }

        &:after {
          position: absolute;
          transform: translateY(-50%);
          top: 50%;
          left: 0;
          content: '';
          display: block;
          width: 100%;
          height: 24px;
          background-image: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0) 80%
          );
          background-size: 200px 24px;
          background-position: -100px 0;
          background-repeat: no-repeat;
          animation: loading 1s infinite;
        }
      }
    `,
  ],
})
export class SkeletonComponent {
  @Input() set lineCount(value: number) {
    this.lines = Array(value)
      .fill(null)
      .map(() => 1);
  }

  protected lines: number[] = [];
}
