<template>
  <div class="card" :key="tarefa['.key']">
    <div class="card-header d-flex justify-content-between">
      <span class="badge badge-primary" v-show="tarefa.importancia === '1'"
        ><i class="far fa-flag"></i> BAIXA
      </span>
      <span class="badge badge-success" v-show="tarefa.importancia === '2'"
        ><i class="far fa-flag"></i> NEUTRA
      </span>
      <span class="badge badge-warning" v-show="tarefa.importancia === '3'"
        ><i class="far fa-flag"></i> ALTA
      </span>
      <span class="badge badge-danger" v-show="tarefa.importancia === '4'"
        ><i class="far fa-flag"></i> CRÍTICA
      </span>
      <span
        class="badge text-uppercase"
        :class="{
          'badge-danger': tarefa.colabId === 1,
          'badge-danger': tarefa.colabId === 2,
          'badge-danger': tarefa.colabId === 3,
          'badge-danger': tarefa.colabId === 4,
          'badge-danger': tarefa.colabId === 5
        }"
      >
        <i class="far fa-user "></i>
        <strong class="pl-2">{{ tarefa.colabNome }}</strong>
      </span>
      <span v-show="tarefa.status != 3" class="badge badge-dark">
        <i class="far fa-calendar-alt"></i
        ><strong class="pl-2">{{ mudarData(tarefa.prazo) }}</strong></span
      >

      <span v-show="tarefa.status === 3" class="badge badge-success">
        <i class="fas fa-check-circle"></i
        ><strong class="pl-2">{{ mudarData(tarefa.dataTermino) }}</strong></span
      >
    </div>
    <div class="card-body">
      <p class="font-weight-bold">
        {{ tarefa.titulo }} - {{ tarefa.clienteNome }}
      </p>
      <p
        v-on:click="MostrarMaisTexto = !MostrarMaisTexto"
        class="card-text"
        :class="{ 'text-truncate': !MostrarMaisTexto }"
      >
        {{ tarefa.detalhe }}
      </p>
    </div>
    <div class="card-footer d-flex justify-content-between">
      <div class="btn-group-sm btn-group">
        <button
          class="btn btn-outline-light"
          v-on:click="mudarStatus(tarefa['.key'], 1, tarefa.titulo)"
        >
          <i class="far fa-clock"></i>
        </button>
        <button
          class="btn btn-outline-light"
          v-on:click="mudarStatus(tarefa['.key'], 2, tarefa.titulo)"
        >
          <i class="far fa-play-circle"></i>
        </button>
        <button
          class="btn btn-outline-light"
          v-on:click="mudarStatus(tarefa['.key'], 3, tarefa.titulo)"
        >
          <i class="far fa-check-circle"></i>
        </button>
      </div>
      <div class="btn-group-sm btn-group">
        <button
          class="btn btn-outline-light"
          v-on:click="
            EmitEditarTarefa(
              tarefa['.key'],
              tarefa.titulo,
              tarefa.detalhe,
              tarefa.clienteNome,
              tarefa.clienteId,
              tarefa.colabNome,
              tarefa.colabId,
              tarefa.importancia,
              tarefa.status,
              tarefa.criadaEm,
              tarefa.prazo
            )
          "
        >
          editar
        </button>
        <button
          class="btn btn-outline-light"
          v-on:click="deletarTarefa(tarefa['.key'])"
        >
          deletar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "../event-bus";
import { db } from "../data";
import moment from "moment";
let dateObj = new Date();
let ano = dateObj.getUTCFullYear();
let mes =
  dateObj.getUTCMonth() + 1 < 10
    ? `0${dateObj.getUTCMonth() + 1}`
    : dateObj.getUTCMonth() + 1;
let dia = dateObj.getUTCDate();
let dataAtual = `${ano}-${mes}-${dia}`;
moment.locale("pt-br");
export default {
  name: "CardTask",
  data: function() {
    return {
      MostrarMaisTexto: false
    };
  },
  props: {
    tarefa: {
      required: true
    }
  },
  methods: {
    mudarStatus: function(taksid, status) {
      db.ref("tarefas")
        .child(taksid)
        .update({ status: status, dataTermino: dataAtual });
    },
    deletarTarefa: function(id) {
      if (confirm("Deletar tarefas?")) {
        db.ref("tarefas")
          .child(id)
          .remove();

        alert("Tarefa excluida");
      } else {
        return;
      }
    },
    mudarData: function(data) {
      return moment(data).format("D [de] MMM");
    },
    EmitEditarTarefa: function(
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
      EventBus.$emit(
        "editarTarefa",
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
      );
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
