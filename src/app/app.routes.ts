import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () =>
          import('./pages/shop-view/shop-view.routes').then(
            (m) => m.ShopViewRoutes,
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/shop-view/shop-view.routes').then(
            (m) => m.ShopViewRoutes,
          ),
      },
      {
        path: 'shop_view',
        loadChildren: () =>
          import('./pages/shop-view/shop-view.routes').then(
            (m) => m.ShopViewRoutes,
          ),
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./pages/quality-punching/quality-punching.routes').then(
            (m) => m.QualityPunchingComponentRoutes,
          ),
        // canActivate: [AuthGuard],
      },
      // {
      //   path: 'reciepe-master',
      //   loadChildren: () =>
      //     import('./pages/master-data/reciepe-master.routes').then((m) => m.ReciepeMasterRoutes),
      // },
      {
        path: 'equipment',
        loadChildren: () =>
          import('./pages/master-data/equipment.routes').then(
            (m) => m.EquipmentRoutes,
          ),
        // canActivate: [AuthGuard]
      },

      {
        path: 'inspection',
        loadChildren: () =>
          import('./pages/inspection/inspection.routes').then(
            (m) => m.ProductionRoutes,
          ),
      },
      {
        path: 'model',
        loadChildren: () =>
          import('./pages/master-data/model.routes').then((m) => m.ModelRoutes),
      },
      {
        path: 'variant',
        loadChildren: () =>
          import('./pages/master-data/variant.routes').then(
            (m) => m.VariantRoutes,
          ),
      },

      {
        path: 'shift',
        loadChildren: () =>
          import('./pages/master-data/shift.routes').then((m) => m.ShiftRoutes),
      },
      {
        path: 'breaks',
        loadChildren: () =>
          import('./pages/master-data/breaks.routes').then(
            (m) => m.BreacksRoutes,
          ),
      },
      {
        path: 'recipes',
        loadChildren: () =>
          import('./pages/master-data/recipes.routes').then(
            (m) => m.RecipesRoutes,
          ),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes,
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
