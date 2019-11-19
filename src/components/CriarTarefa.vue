<template>
  <div class="card">
    <div class="card-header">
      TAREFA
    </div>
    <div class="card-body">
      <div class="form-group m-0">
        <label class="mb-0">O que é preciso fazer?</label>
        <input class="form-control" v-model="novaTarefa.titulo" type="text" />
      </div>
      <div class="form-group m-0">
        <label class="mb-0">Detalhes</label>
        <textarea
          class="form-control"
          v-model="novaTarefa.detalhe"
          rows="2"
        ></textarea>
      </div>
      <div class="form-group m-0">
        <label class="mb-0">para quem?</label>
        <select class="form-control" v-model="novaTarefa.cliente">
          <option
            v-for="cliente in clientes"
            v-show="cliente.status === 'ativo'"
            :value="{
              clienteId: cliente.clienteId,
              clienteNome: cliente.nome
            }"
            :key="cliente.key"
            >{{ cliente.nome }}</option
          >
        </select>
      </div>
      <div class="form-group m-0">
        <label class="mb-0">Quem vai fazer?</label>
        <select class="form-control" v-model="novaTarefa.colab">
          <option
            v-for="colab in colabs"
            :key="colab.key"
            :value="{ colabId: colab.colabId, colabNome: colab.nome }"
            >{{ colab.nome }}</option
          >
        </select>
      </div>
      <div class="form-group">
        <label class="mb-0">Qual a prioridade?</label>
        <select v-model="novaTarefa.importancia" class="form-control">
          <option selected value="1">Baixa prioridade</option>
          <option value="2">neutra</option>
          <option value="3">Alta prioridade</option>
          <option value="4">Crítica</option>
        </select>
      </div>
      <div class="form-group">
        <label class="mb-0">Para quando?</label>
        <input class="form-control" v-model="novaTarefa.prazo" type="date" />
      </div>
      <button
        class="btn btn-primary btn-block"
        v-show="novaTarefa.botao"
        type="button"
        v-on:click="criarTarefa()"
      >
        CRIAR TAREFA
      </button>
      <button
        class="btn btn-secondary btn-block"
        v-show="tarefaEmEdicao.botao"
        type="button"
        v-on:click="salvarEdicaoTarefa(tarefaEmEdicao.id)"
      >
        EDITAR TAREFA
      </button>
    </div>
  </div>
</template>

<script>
import EventBus from "../event-bus";
import { db } from "../data";

let dateObj = new Date();
let ano = dateObj.getUTCFullYear();
let mes =
  dateObj.getUTCMonth() + 1 < 10
    ? `0${dateObj.getUTCMonth() + 1}`
    : dateObj.getUTCMonth() + 1;
let dia = dateObj.getUTCDate();
let dataAtual = `${ano}-${mes}-${dia}`;
// let amanha = `${ano}-${mes}-${(dia += 1)}`;
let dataCriacao = `${dia} - ${mes}`;

export default {
  name: "CriarTarefa",
  props: {
    clientes: {
      required: true
    },
    colabs: {
      required: true
    }
  },
  created() {
    let vm = this;
    EventBus.$on("editarTarefa", function(
      id,
      titulo,
      detalhe,
      clienteNome,
      clienteId,
      colabNome,
      colabId,
      importancia,
      status,
      criadaEm,
      prazo
    ) {
      vm.tarefaEmEdicao = {
        id: id,
        status: status,
        botao: true
      };

      vm.novaTarefa = {
        titulo,
        detalhe,
        cliente: {
          clienteId,
          clienteNome
        },
        colab: {
          colabId: colabId,
          colabNome: colabNome
        },
        importancia,
        criadaEm,
        prazo,
        botao: false
      };
    });
  },
  data: function() {
    return {
      novaTarefa: {
        titulo: "",
        detalhe: "",
        cliente: {},
        colab: {},
        importancia: 1,
        botao: true,
        prazo: dataAtual
      },
      tarefaEmEdicao: {
        botao: false,
        id: "",
        status: ""
      }
    };
  },
  methods: {
    limparTarefa: function() {
      this.novaTarefa = {
        titulo: "",
        detalhe: "",
        cliente: {},
        colab: {},
        importancia: 1,
        criadaEm: dataAtual,
        botao: true
      };
    },

    criarTarefa: function() {
      db.ref("tarefas").push({
        titulo: this.novaTarefa.titulo,
        detalhe: this.novaTarefa.detalhe,
        clienteId: this.novaTarefa.cliente.clienteId,
        clienteNome: this.novaTarefa.cliente.clienteNome,
        colabId: this.novaTarefa.colab.colabId,
        colabNome: this.novaTarefa.colab.colabNome,
        status: 1,
        prazo: this.novaTarefa.prazo,
        importancia: this.novaTarefa.importancia,
        criadaEm: dataCriacao
      });
      this.limparTarefa();
    },
    salvarEdicaoTarefa: function(taksid) {
      db.ref("tarefas")
        .child(taksid)
        .update({
          titulo: this.novaTarefa.titulo,
          detalhe: this.novaTarefa.detalhe,
          clienteId: this.novaTarefa.cliente.clienteId,
          clienteNome: this.novaTarefa.cliente.clienteNome,
          colabId: this.novaTarefa.colab.colabId,
          colabNome: this.novaTarefa.colab.colabNome,
          importancia: this.novaTarefa.importancia,
          criadaEm: this.novaTarefa.criadaEm,
          prazo: this.novaTarefa.prazo,
          status: this.tarefaEmEdicao.status
        });
      this.limparTarefa();
      this.tarefaEmEdicao.botao = false;
      this.novaTarefa.botao = true;
    }
  }
};
</script>
