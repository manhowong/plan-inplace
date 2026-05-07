/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import logo from '@assets/images/logo.png';
import logoWhite from '@assets/images/logo-white.png';
import { usePlan } from '@packages/storage/PlanContext';
import {Heart} from 'lucide-react';

export function About() {
  const { globalTheme } = usePlan();
  const currentLogo = globalTheme === 'dark' ? logoWhite : logo;

  return (
    <div className="h-full overflow-y-auto bg-bg p-8 sm:p-12">
      <div className="max-w-2xl space-y-12">
        <img src={currentLogo} alt="Plan InPlace" className="h-8 w-fit object-contain" />

        <div className="space-y-8">
          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase">Source</h2>
            <a 
              href="https://github.com/manhowong/plan-inplace" 
              target="_blank" 
              rel="noreferrer" 
              className="text-base text-accent hover:underline font-medium"
            >
              github.com/manhowong/plan-inplace
            </a>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase">Developer</h2>
            <a 
              href="https://github.com/manhowong" 
              target="_blank" 
              rel="noreferrer" 
              className="text-base text-accent hover:underline font-medium"
            >
              @manhowong
            </a>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase">Support</h2>
            <div className="space-y-2">
              <a 
                href="https://github.com/manhowong/plan-inplace/issues/new" 
                target="_blank" 
                rel="noreferrer" 
                className="text-base text-accent hover:underline font-medium"
              >
                Suggest or report an issue
              </a>
              <br/>
              <a 
                href="https://github.com/sponsors/manhowong" 
                target="_blank" 
                rel="noreferrer" 
                className="text-base text-accent hover:underline font-medium inline-flex items-center gap-1"
              >
                Sponsor me on GitHub
                <Heart className="w-4 h-4 text-red-500" />
              </a>
                            
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase">License</h2>
            <a 
              href="https://github.com/manhowong/plan-inplace/blob/main/LICENSE" 
              target="_blank" 
              rel="noreferrer" 
              className="text-base text-accent hover:underline font-medium"
            >
              Apache License 2.0
            </a>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase">Versions</h2>
            <div className="space-y-1">
              <p className="text-base text-text-primary font-medium">Web App (Beta)</p>
              <p className="text-base text-text-secondary">VS Code Extension (Coming Soon)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
