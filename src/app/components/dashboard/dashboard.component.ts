import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { FormGroup } from '@angular/forms';
import {Paciente} from '../../shared/services/paciente';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  //teste arraypaciente
  items: Paciente[];
  erro: any

  //teste seguro (ignorar)
  pacientesarray: Array<any>

  //variavel guarda os dados do usuario (ignorar)
  pacientesform: any;
  
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
  ) { }

  ngOnInit() { 
    this.pacientesform = {}
  }
  //metodo para passa os valores do formulario pra API
  add(cpfitem: number, nomeitem:string, sexoitem:string, idadeitem: number, checkboxitem:boolean, observacaoitem: string) {
    this.authService.armazenar2(cpfitem, nomeitem, sexoitem, idadeitem, checkboxitem, observacaoitem).subscribe(
      (item: Paciente) => this.items.push(item)
    );
  }

  //metodo para trabalhar com o forms (ignorar)
  armazenar(frm: FormGroup){
    this.authService.armazenar(this.pacientesform).subscribe(resposta =>{
      this.pacientesarray.push(resposta)

      frm.reset()
    })
  }

}
