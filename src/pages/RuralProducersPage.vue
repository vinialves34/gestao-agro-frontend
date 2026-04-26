<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ruralProducerApi } from "../services/api";
import type { RuralProducer } from "../models/RuralProducer";
import type { IPaginationData } from "../services/interfaces/IPaginationData";
import {
  Button,
  Column,
  DataTable,
  Dialog,
  FloatLabel,
  InputMask,
  InputText,
} from "primevue";
import { Sweetalert, ToastAlert } from "../utils/sweetalertUtils";
import "primeicons/primeicons.css";

const ruralProducers = ref<RuralProducer[]>([]);
const paginationData = ref<IPaginationData>();
const dialogTitle = ref("");
const dialog = ref(false);
const editing = ref(false);

const form = ref<RuralProducer>({
  name: "",
  email: "",
  phone: "",
  address: "",
  cpf_cnpj: "",
});

const loadRuralProducers = async () => {
  const response = await ruralProducerApi.getAll();
  ruralProducers.value = response.data.data;
  paginationData.value = response.data.meta;
};

const saveRuralProducer = async () => {
  if (editing.value && form.value.id) {
    await ruralProducerApi.update(form.value.id, form.value);
    ToastAlert.fire(
      "Atualizado!",
      "O produtor rural foi atualizado.",
      "success",
    );
  } else {
    await ruralProducerApi.create(form.value);
    ToastAlert.fire("Criado!", "O produtor rural foi criado.", "success");
  }

  dialog.value = false;
  resetForm();
  loadRuralProducers();
};

const editRuralProducer = (producer: RuralProducer) => {
  form.value = { ...producer };
  editing.value = true;
  dialog.value = true;
  dialogTitle.value = "Editar Produtor Rural";
};

const removeRuralProducer = async (id: number) => {
  await ruralProducerApi.delete(id);
  loadRuralProducers();
};

const resetForm = () => {
  form.value = {
    name: "",
    email: "",
    phone: "",
    address: "",
    cpf_cnpj: "",
  };
  editing.value = false;
};

const confirmDelete = (id: number) => {
  Sweetalert.fire({
    title: "Confirmação de Exclusão",
    text: "Tem certeza de que deseja excluir este produtor rural?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "p-button p-component p-button-danger",
      cancelButton: "p-button p-component p-button-secondary",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      await removeRuralProducer(id);
      ToastAlert.fire("Excluído!", "O produtor rural foi excluído.", "success");
    }
  });
};

onMounted(loadRuralProducers);
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 my-8 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-green-700">Produtores Rurais</h2>

    <div class="flex flex-row-reverse my-4">
      <Button
        label="Novo"
        icon="pi pi-plus"
        @click="
          ((dialog = true), (dialogTitle = 'Novo Produtor Rural'), resetForm())
        "
      />
    </div>

    <div class="rounded-lg shadow-sm">
      <DataTable
        paginator
        stripedRows
        :value="ruralProducers"
        :rows="10"
        :totalRecords="paginationData?.total"
        :rowsPerPageOptions="[10, 15, 20]"
        :loading="!ruralProducers.length"
        tableStyle="min-width: 50rem"
      >
        <Column field="name" header="Nome" />
        <Column field="cpf_cnpj" header="CPF/CNPJ" />
        <Column field="email" header="Email" />
        <Column field="phone" header="Telefone" />
        <Column field="address" header="Endereço" />

        <Column header="Ações">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                v-tooltip.bottom="'Editar'"
                icon="pi pi-pencil"
                @click="editRuralProducer(slotProps.data)"
              />
              <Button
                v-tooltip.bottom="'Excluir'"
                icon="pi pi-trash"
                severity="danger"
                @click="confirmDelete(slotProps.data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="dialog"
      :header="dialogTitle"
      :pt="{ content: 'flex flex-col gap-4' }"
    >
      <FloatLabel variant="in">
        <InputText id="cpf_cnpj" v-model="form.cpf_cnpj" class="w-full" />
        <label for="cpf_cnpj">CPF/CNPJ</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="nome" v-model="form.name" class="w-full" />
        <label for="nome">Nome</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="email" v-model="form.email" class="w-full" />
        <label for="email">E-mail</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputMask
          id="telefone"
          v-model="form.phone"
          mask="(99) 99999-9999"
          class="w-full"
        />
        <label for="telefone">Telefone</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="endereco" v-model="form.address" class="w-full" />
        <label for="endereco">Endereço</label>
      </FloatLabel>

      <Button label="Salvar" @click="saveRuralProducer" />
    </Dialog>
  </section>
</template>
