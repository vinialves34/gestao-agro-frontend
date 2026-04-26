<script setup lang="ts">
import { ref, onMounted } from "vue";
import { propertyApi, ruralProducerApi } from "../services/api";
import type { Property } from "../models/Property";
import type { IPaginationData } from "../services/interfaces/IPaginationData";
import {
  Button,
  Column,
  DataTable,
  Dialog,
  FloatLabel,
  InputText,
  Select,
} from "primevue";
import { Sweetalert, ToastAlert } from "../utils/sweetalertUtils";
import "primeicons/primeicons.css";
import { ibgeApi } from "../services/ibge-api";
import type { RuralProducer } from "../models/RuralProducer";

const properties = ref<Property[]>([]);
const ruralProducers = ref<RuralProducer[]>([]);
const paginationData = ref<IPaginationData>();
const states = ref([]);
const cities = ref([]);
const selectedState = ref();
const selectedCity = ref();
const selectedRuralProducer = ref();
const dialogTitle = ref("");
const dialog = ref(false);
const editing = ref(false);

const form = ref<Property>({
  name: "",
  city: "",
  state: "",
  total_area: "",
  state_registration: "",
  producer_id: null,
});

const loadProperties = async () => {
  const response = await propertyApi.getAll();
  properties.value = response.data.data;
  paginationData.value = response.data.meta;
};

const loadStates = async () => {
  const response = await ibgeApi.getStates();
  states.value = response.data;
};

const loadCities = async () => {
  const response = await ibgeApi.getCitiesByState(selectedState.value.sigla);
  cities.value = response.data;
};

const loadRuralProducers = async () => {
  const response = await ruralProducerApi.getAll();
  ruralProducers.value = response.data.data;
};

const saveProperty = async () => {
  form.value.state = selectedState.value ? selectedState.value.sigla : "";
  form.value.city = selectedCity.value
    ? selectedCity.value["municipio-nome"]
    : "";
  form.value.producer_id = selectedRuralProducer.value
    ? selectedRuralProducer.value.id
    : null;

  //CRIAR FILTRO PARA TRAZER DE UM FORMA MELHOR OS PROPRIETÁRIOS 

  if (editing.value && form.value.id) {
    await propertyApi.update(form.value.id, form.value);
    ToastAlert.fire("Atualizado!", "A propriedade foi atualizada.", "success");
  } else {
    await propertyApi.create(form.value);
    ToastAlert.fire("Criado!", "A propriedade foi criada.", "success");
  }

  dialog.value = false;
  resetForm();
  loadProperties();
};

const editProperty = async (property: Property) => {
  form.value = { ...property };
  selectedState.value = states.value.find(
    (state: any) => state.sigla === property.state,
  );

  await loadCities();
  selectedCity.value = cities.value.find(
    (city: any) => city["municipio-nome"].toUpperCase() === property.city,
  );

  selectedRuralProducer.value = ruralProducers.value.find(
    (ruralProducer: any) => ruralProducer.id === property.producer_id,
  );

  editing.value = true;
  dialog.value = true;
  dialogTitle.value = "Editar Propriedade";
};

const removeProperty = async (id: number) => {
  await propertyApi.delete(id);
  loadProperties();
};

const resetForm = () => {
  form.value = {
    name: "",
    city: "",
    state: "",
    total_area: "",
    state_registration: "",
    producer_id: null,
  };
  selectedCity.value = ref();
  selectedState.value = ref();
  selectedRuralProducer.value = ref();
  editing.value = false;
};

const confirmDelete = (id: number) => {
  Sweetalert.fire({
    title: "Confirmação de Exclusão",
    text: "Tem certeza de que deseja excluir esta propriedade?",
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
      await removeProperty(id);
      ToastAlert.fire("Excluído!", "A propriedade foi excluída.", "success");
    }
  });
};

onMounted(() => {
  loadProperties();
  loadStates();
  loadRuralProducers();
});
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 my-8 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-green-700">Propriedades</h2>

    <div class="flex flex-row-reverse my-4">
      <Button
        label="Novo"
        icon="pi pi-plus"
        @click="
          ((dialog = true), (dialogTitle = 'Nova Propriedade'), resetForm())
        "
      />
    </div>

    <div class="rounded-lg shadow-sm">
      <DataTable
        paginator
        stripedRows
        :value="properties"
        :rows="10"
        :totalRecords="paginationData?.total"
        :rowsPerPageOptions="[10, 15, 20]"
        :loading="!properties.length"
        tableStyle="min-width: 50rem"
      >
        <Column field="name" header="Nome" />
        <Column field="city" header="Município" />
        <Column field="state" header="Estado" />
        <Column field="total_area" header="Área Total" />
        <Column field="state_registration" header="Inscrição Estadual" />
        <Column field="rural_producer.name" header="Proprietário" />

        <Column header="Ações">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                v-tooltip.bottom="'Editar'"
                icon="pi pi-pencil"
                @click="editProperty(slotProps.data)"
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
        <InputText id="nome" v-model="form.name" class="w-full" />
        <label for="nome">Nome da propriedade</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Select
          id="municipio"
          v-model="selectedCity"
          editable
          :options="cities"
          optionLabel="municipio-nome"
          :disabled="!Object.keys(selectedState).find((key) => key === 'sigla')"
          class="w-full"
        />
        <label for="municipio">Município</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Select
          id="estado"
          v-model="selectedState"
          @change="
            () => {
              loadCities();
              selectedCity = ref();
            }
          "
          editable
          :options="states"
          optionLabel="sigla"
          class="w-full"
        />
        <label for="estado">Estado</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="area_total" v-model="form.total_area" class="w-full" />
        <label for="area_total">Área Total</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText
          id="inscricao_estadual"
          v-model="form.state_registration"
          class="w-full"
        />
        <label for="incricao_estadual">Inscrição Estadual</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Select
          id="produtor_rural"
          v-model="selectedRuralProducer"
          @change="loadRuralProducers()"
          editable
          :options="ruralProducers"
          optionLabel="name"
          class="w-full"
        />
        <label for="produtor_rural">Proprietário</label>
      </FloatLabel>
      <Button label="Salvar" @click="saveProperty" />
    </Dialog>
  </section>
</template>
