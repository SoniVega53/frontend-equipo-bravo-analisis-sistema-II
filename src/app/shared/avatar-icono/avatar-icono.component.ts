import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '../../ui/base.component';
import { UsuarioService } from '../../core/services/usuarios.service';

@Component({
  selector: 'avatar-icono',
  standalone: true,
  templateUrl: './avatar-icono.component.html',
  styleUrl: './avatar-icono.component.css'
})
export class AvatarIconoComponent extends BaseComponent implements OnInit{

  @ViewChild('fileInput')fileInput!: ElementRef<HTMLInputElement>;

  usuarioService = inject(UsuarioService);

  @Input() idUsuario:string = '';
  @Input() nombre:string = '';
  @Input() fotografia:string = '';
  @Input() eActiveAction:boolean = true;
  @Input() width:string = '120px';
  @Input() height:string = '120px';
  @Input() fontSize:string = '3rem';
  @Output() updateFoto = new EventEmitter<string>();


  ngOnInit(): void {

  }

  abrirSelectorImagen(): void {
    if (this.fileInput) {
       this.fileInput.nativeElement.click();
    }
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file && this.idUsuario) {
      await this.executeService({
        callback: async () => {
          
          const response: any = await this.usuarioService.actualizarFotografia(this.idUsuario, file);

          if (response && response.data && response.data.nuevaUrl) {
            this.fotografia = response.data.nuevaUrl;
            this.updateFoto.emit(this.fotografia)
            this.showSuccessAlert('Fotografía actualizada correctamente');
          }
        },
      });
      
      this.isLoading = false;
      event.target.value = null; 
    }
  }
}
