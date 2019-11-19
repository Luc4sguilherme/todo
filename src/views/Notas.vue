<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 pb-2">
        <div class="card rounded">
          <div class="card-header">ADICIONAR NOTA</div>
          <div class="card-body">
            <div class="form-group">
              <textarea
                rows="4"
                type="text"
                class="form-control"
                v-model="texto"
                placeholder="Anotar aqui coisas que não são tarefas, e não podemos esquecer."
              />
            </div>
            <button v-on:click="criarNota()" class="btn btn-info btn-block">
              SALVAR NOTA
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div
        class="col-lg-3 col-md-4 col-sm-12"
        v-for="nota in notas"
        :key="nota.key"
      >
        <div class="card bg-igor text-dark mb-3">
          <div class="card-header bg-igor d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-dark mr-3">
              <i class="far fa-edit"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-dark"
              v-on:click="deletarNota(nota['.key'])"
            >
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
          <div class="card-body text-justify">{{ nota.texto }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../data";
export default {
  name: "notas",
  data: function() {
    return {
      texto: "",
      notas: []
    };
  },
  methods: {
    criarNota: function() {
      db.ref("notas").push({
        texto: this.texto
      });
      this.texto = "";
    },
    deletarNota: function(id) {
      if (confirm("Deletar tarefas?")) {
        db.ref("notas")
          .child(id)
          .remove();

        alert("Tarefa excluida");
      } else {
        return;
      }
    }
  },
  firebase: {
    notas: db.ref("notas")
  }
};
</script>
