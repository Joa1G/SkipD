import { Provider } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { AbstractInsightsService } from './abstract-insights.service';
import { InsightsService } from './insights.service';
import { MockedInsightsService } from './mocked-insights.service';

export const insightsProvider: Provider = {
    provide: AbstractInsightsService,
    useFactory: (
        realService: InsightsService,
        mockedService: MockedInsightsService
    ) => {
        return realService;

        /* CÓDIGO ORIGINAL COMENTADO
        if (environment.useMockService) {
            return mockedService;
        }
        return realService;
        */
    },
    deps: [InsightsService, MockedInsightsService]
};
