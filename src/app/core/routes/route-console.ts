import { Routes } from '@angular/router';
import { WelcomeComponent } from '../../ui/welcome/welcome.component';
import { EmpresaComponent } from '../../ui/console/empresa/empresa.component';
import { GeneroComponent } from '../../ui/console/genero/genero.component';
import { AccesoDenegadoComponent } from '../../ui/acceso-denegado/acceso-denegado.component';
import { NotFoundComponent } from '../../ui/not-found/not-found.component';
import { AsignacionOpcionRoleComponent } from '../../ui/console/asignacion-opcion-role/asignacion-opcion-role.component';
import { UsuarioComponent } from '../../ui/console/usuario/usuario.component';
import { SucursalComponent } from '../../ui/console/sucursal/sucursal.component';
import { StatusUsuarioComponent } from '../../ui/console/status-usuario/status-usuario.component';
import { RoleComponent } from '../../ui/console/role/role.component';
import { ModuloComponent } from '../../ui/console/modulo/modulo.component';
import { MenuComponent } from '../../ui/console/menu/menu.component';
import { OpcionComponent } from '../../ui/console/opcion/opcion.component';
import { RolesComponent } from '../../ui/console/roles/roles.component';
import { InasistenciaComponent } from '../../ui/console/inasistencia/inasistencia.component';
import { CalculoPlanillaComponent } from '../../ui/console/calculo-planilla/calculo-planilla.component';
import { ReportePlanillaComponent } from '../../ui/console/reporte-planilla/reporte-planilla.component';
import { LiquidacionComponent } from '../../ui/console/liquidacion/liquidacion.component';
import { BoletaPagoComponent } from '../../ui/console/boleta-pago/boleta-pago.component';

import { EstadoCivilComponent } from '../../ui/console/estado-civil/estado-civil.component';
import { DepartamentoComponent } from '../../ui/console/departamento/departamento.component';
import { PuestoComponent } from '../../ui/console/puesto/puesto.component';

import { BancoComponent } from '../../ui/console/banco/banco.component';
import { PersonaComponent } from '../../ui/console/persona/persona.component';
import { EmpleadoComponent } from '../../ui/console/empleado/empleado.component';

export const CONSOLE_ROUTES: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'empresa/:code',
    component: EmpresaComponent,
  },
  {
    path: 'sucursal/:code',
    component: SucursalComponent,
  },
  {
    path: 'banco/:code',
    component: BancoComponent,
  },
  {
    path: 'personas/:code',
    component: PersonaComponent,
  },
  {
    path: 'empleado/:code',
    component: EmpleadoComponent,
  },
  {
    path: 'estado_civil/:code',
    component: EstadoCivilComponent,
  },
  {
    path: 'departamento/:code',
    component: DepartamentoComponent,
  },
  {
    path: 'puesto/:code',
    component: PuestoComponent,
  },
  {
    path: 'genero/:code',
    component: GeneroComponent,
  },
  {
    path: 'status_usuario/:code',
    component: StatusUsuarioComponent,
  },
  {
    path: 'usuario/:code',
    component: UsuarioComponent,
  },
  {
    path: 'role/:code',
    component: RolesComponent,
  },
  {
    path: 'modulo/:code',
    component: ModuloComponent,
  },
  {
    path: 'menu/:code',
    component: MenuComponent,
  },
  {
    path: 'opcion/:code',
    component: OpcionComponent,
  },
  {
    path: 'asignacion_opcion_role/:code',
    component: AsignacionOpcionRoleComponent,
  },
  {
    path: 'inasistencia/:code',
    component: InasistenciaComponent,
  },
  {
    path: 'calculo_planilla/:code',
    component: CalculoPlanillaComponent,
  },
  {
    path: 'reporte_planilla/:code',
    component: ReportePlanillaComponent,
  },
  {
    path: 'liquidacion/:code',
    component: LiquidacionComponent,
  },
  {
    path: '403',
    component: AccesoDenegadoComponent,
  },
  {
    path: 'boleta_pago/:code',
    component: BoletaPagoComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];