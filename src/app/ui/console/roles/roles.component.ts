import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { RoleService } from '../../../core/services/role.service';
import { Role } from '../../../interface/role.interface';


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent extends BaseComponent implements OnInit {
  private roleService = inject(RoleService);

  roles: Role[] = [];

  roleModel: Role = {
    nombre: '',
    descripcion: '',
  };

  editando = false;

  async ngOnInit(): Promise<void> {
    await this.onChangeViewURL(async () => {
      await this.cargarRoles();
    });
    
  }

  async cargarRoles() {
    await this.executeService({
      callback: async () => {
        const data: any = await this.roleService.getRoles();
        this.roles = Array.isArray(data) ? data : [];
      },
    });
  }

  async guardar() {
    if (!this.roleModel.nombre.trim()) {
      return;
    }

    await this.executeService({
      callback: async () => {
        await this.roleService.crearOActualizar(this.roleModel);

        this.showSuccessAlert(
          this.editando
            ? 'Rol actualizado correctamente'
            : 'Rol creado correctamente',
        );

        this.limpiarFormulario();
        await this.cargarRoles();
      },
    });
  }

  editar(role: Role) {
    this.roleModel = {
      idRole: role.idRole,
      nombre: role.nombre,
      descripcion: role.descripcion || '',
    };

    this.editando = true;
  }

  async eliminar(role: Role) {
    if (!role.idRole) {
      return;
    }

     this.showDeleteConfirm(async () => {
      await this.executeService({
        callback: async () => {
          await this.roleService.eliminar(role.idRole!);
          this.showSuccessAlert('Rol eliminado correctamente');
          this.limpiarFormulario();
          await this.cargarRoles();
        },
      });
    }, 'este rol');
   
  }

  limpiarFormulario() {
    this.roleModel = {
      nombre: '',
      descripcion: '',
    };

    this.editando = false;
  }
}