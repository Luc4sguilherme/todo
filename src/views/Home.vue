<template>
  <div class="row">
    <div class="col-lg-3 col-md-6 col-sm-12 p-1 pt-2">
      <CriarTarefa :clientes="clientes" :colabs="colabs"> </CriarTarefa>
      <div class="card">
        <div class="card-header">
          FILTROS
        </div>
        <div class="card-body">
          <form>
            <div class="form-group">
              <label for="exampleFormControlInput1">Tarefa</label>
              <input
                type="text"
                class="form-control"
                v-model="filtros.tarefa"
                placeholder="Criar tarefa"
              />
            </div>
            <div class="form-group">
              <label for="exampleFormControlSelect1">Colaborador</label>
              <select class="form-control" v-model="filtros.colab">
                <option value="">
                  Todos
                </option>
                <option
                  v-for="colab in colabs"
                  :value="colab.colabId"
                  :key="colab.key"
                  >{{ colab.nome }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="exampleFormControlSelect1">Cliente</label>
              <select class="form-control" v-model="filtros.cliente">
                <option value="">
                  Todos
                </option>
                <option
                  v-for="cliente in clientes"
                  v-show="cliente.status === 'ativo'"
                  :value="cliente.clienteId"
                  :key="cliente.key"
                  >{{ cliente.nome }}
                </option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12 p-1">
      <header>
        <h1 class="h4">
          <i class="far fa-clock"></i> POR FAZER
          <span class="badge badge-danger">{{
            tarefasAtrasadas.length +
              tarefasParaHoje.length +
              tarefasParaAmanha.length +
              tarefasParaDepois.length
          }}</span>
        </h1>
      </header>
      <div class="alert alert-danger" role="alert">
        <h1 class="h6">
          ATRASADAS
          <span class="bg-white text-dark rounded-pill px-2 lead">{{
            tarefasAtrasadas.length
          }}</span>
        </h1>
      </div>
      <CardTask
        v-for="tarefa in tarefasAtrasadas"
        :tarefa="tarefa"
        :key="tarefa['.key']"
      ></CardTask>
      <div class="alert alert-warning">
        <h1 class="h6">
          HOJE
          <span class="bg-white text-dark rounded-pill px-2 lead">{{
            tarefasParaHoje.length
          }}</span>
        </h1>
      </div>
      <CardTask
        v-for="tarefa in tarefasParaHoje"
        :tarefa="tarefa"
        :key="tarefa['.key']"
      ></CardTask>
      <div class="alert alert-keven" role="alert">
        <h1 class="h6">
          AMANHÃ
          <span class="bg-white text-dark rounded-pill px-2 lead">{{
            tarefasParaAmanha.length
          }}</span>
        </h1>
      </div>
      <CardTask
        v-for="tarefa in tarefasParaAmanha"
        :tarefa="tarefa"
        :key="tarefa['.key']"
      ></CardTask>
      <div class="alert alert-success" role="alert">
        <h1 class="h6">
          PRÓXIMOS DIAS
          <span class="bg-white text-dark rounded-pill px-2 lead">{{
            tarefasParaDepois.length
          }}</span>
        </h1>
      </div>
      <CardTask
        v-for="tarefa in tarefasParaDepois"
        :tarefa="tarefa"
        :key="tarefa['.key']"
      ></CardTask>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12 p-1">
      <header>
        <h1 class="h4">
          <i class="far fa-play-circle"></i> FAZENDO
          <span class="badge badge-primary">{{
            tarefasSendoFeitas.length
          }}</span>
        </h1>
      </header>
      <CardTask
        v-for="tarefa in tarefasSendoFeitas"
        :key="tarefa['.key']"
        :tarefa="tarefa"
      ></CardTask>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12 p-1">
      <header>
        <h1 class="h4">
          <i class="far fa-check-circle"></i> FEITAS
          <span class="badge badge-success">{{ tarefasFeitas.length }}</span>
        </h1>
      </header>

      <CardTask
        v-for="tarefa in tarefasFeitas"
        :key="tarefa['.key']"
        :tarefa="tarefa"
      ></CardTask>
    </div>
  </div>
</template>

<script>
import { db } from "../data";
import CardTask from "@/components/CardTask.vue";
import CriarTarefa from "@/components/CriarTarefa.vue";

let dateObj = new Date();
let ano = dateObj.getUTCFullYear();
let mes =
  dateObj.getUTCMonth() + 1 < 10
    ? `0${dateObj.getUTCMonth() + 1}`
    : dateObj.getUTCMonth() + 1;
let dia = dateObj.getUTCDate();
let dataAtual = `${ano}-${mes}-${dia}`;
let amanha = `${ano}-${mes}-${(dia += 1)}`;

export default {
  name: "home",
  components: {
    CardTask,
    CriarTarefa
  },
  data: function() {
    return {
      clientes: [],
      colabs: [],
      db_tarefas: [],
      filtros: {
        colab: "",
        cliente: "",
        tarefa: ""
      },
      relatorios: []
    };
  },
  computed: {
    tarefas: function() {
      let tasks = this.db_tarefas;
      let vm = this;
      if (this.filtros.colab) {
        tasks = tasks.filter(function(task) {
          return task.colabId === vm.filtros.colab;
        });
      }
      if (this.filtros.cliente) {
        tasks = tasks.filter(function(task) {
          return task.clienteId === vm.filtros.cliente;
        });
      }
      if (this.filtros.tarefa) {
        tasks = tasks.filter(function(task) {
          return task.titulo
            .toLowerCase()
            .includes(vm.filtros.tarefa.toLowerCase());
        });
      }

      tasks = tasks.sort(function(a, b) {
        let keyA = new Date(a.prazo);
        let keyB = new Date(b.prazo);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      tasks = tasks.sort(function(a, b) {
        let keyA = new Date(a.importancia);
        let keyB = new Date(b.importancia);
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
      return tasks;
    },

    tarefasAtrasadas: function() {
      return this.tarefas.filter(function(task) {
        return task.prazo < dataAtual && task.status === 1;
      });
    },
    tarefasParaHoje: function() {
      return this.tarefas.filter(function(task) {
        return task.prazo === dataAtual && task.status === 1;
      });
    },
    tarefasParaAmanha: function() {
      return this.tarefas.filter(function(task) {
        return task.prazo === amanha && task.status === 1;
      });
    },
    tarefasParaDepois: function() {
      return this.tarefas.filter(function(task) {
        return task.prazo > amanha && task.status === 1;
      });
    },
    tarefasSendoFeitas: function() {
      return this.tarefas.filter(function(task) {
        return task.status === 2;
      });
    },
    tarefasFeitas: function() {
      let tasks = this.tarefas;
      tasks = tasks.filter(function(task) {
        return task.status === 3;
      });
      tasks = tasks.sort(function(a, b) {
        let keyA = new Date(a.dataTermino),
          keyB = new Date(b.dataTermino);
        // Compare the 2 dates
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
      return tasks;
    }
  },
  firebase: {
    db_tarefas: db.ref("tarefas"),
    clientes: db.ref("clientes").orderByChild("nome"),
    colabs: db.ref("colab").orderByChild("nome"),
    relatorios: db.ref("relatorios")
  }
};
</script>
