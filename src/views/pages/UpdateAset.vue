<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Update Data Aset</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm @submit.prevent="submitForm">

                        <div class="mb-3">
                            <CFormLabel for="asset_name">Nama Aset</CFormLabel>
                            <CFormInput id="asset_name" v-model="asset_name" type="text"
                                placeholder="masukkan nama aset" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_brand">Nama Merk</CFormLabel>
                            <CFormInput id="asset_brand" v-model="asset_brand" type="text"
                                placeholder="masukkan merk aset" />
                        </div>
                        <div class="mb-3">
    <CFormLabel for="asset_image">Lampiran (Gambar Aset)</CFormLabel>
    <CFormInput
        id="asset_image"
        ref="assetImage"
        type="file"
        accept="image/*"
        placeholder="Masukkan gambar aset jpg, jpeg, png"
        @change="handleFileChange"
    />
    <div v-if="!isNewFileSelected && oldFileName" class="mt-2 text-sm text-gray-500">
        <span style="font-weight: bold;">
            📄 Data existing : {{ oldFileName }}
        </span>
    </div>
</div>
                        <div class="mb-3">
                            <CFormLabel for="asset_specification">Spesifikasi Aset</CFormLabel>
                            <CFormTextarea id="asset_specification" v-model="asset_specification" rows="3">
                            </CFormTextarea>
                        </div>

                        <div v-if="isKlasifikasiaRequired" class="mb-4">
                            <CFormLabel for="asset_classification">Pilih Klasifikasi</CFormLabel>
                            <select id="asset_classification" v-model="selectedKlasifikasi"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchKlasifikasi">
                                <option value="">Pilih Klasifikasi</option>
                                <option v-for="klasifikasi in klasifikasis" :key="klasifikasi.classificationId"
                                    :value="klasifikasi.classificationId">
                                    {{ klasifikasi.classificationName }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <CFormLabel for="personal_responsible">Pilih Penanggung jawab</CFormLabel>
                            <CFormInput id="personal_responsible" v-model="personal_responsible" type="text"
                                placeholder="masukkan penanggung jawab" />
                        </div>

                        <div class="mb-3 flex space-x-8">
                            <div>
                                <CFormLabel for="asset_condition">Kondisi Aset</CFormLabel>
                                <div class="flex space-x-4">
                                    <input id="Baru" v-model="asset_condition" type="radio" name="asset_condition"
                                        value="Baru" />
                                    <label for="Baru">Baru</label>
                                    <input id="Bekas" v-model="asset_condition" type="radio" name="asset_condition"
                                        value="Bekas" />
                                    <label for="Bekas">Bekas</label>
                                </div>
                            </div>

                            <div>
                                <CFormLabel for="asset_status">Status Aset</CFormLabel>
                                <div class="flex space-x-4">
                                    <input id="Baik" v-model="asset_status" type="radio" name="asset_status"
                                        value="Baik" />
                                    <label for="Baik">Baik</label>
                                    <input id="Buruk" v-model="asset_status" type="radio" name="asset_status"
                                        value="Buruk" />
                                    <label for="Buruk">Buruk</label>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_purchase_date">Tanggal Pembelian Aset</CFormLabel>
                            <CFormInput id="asset_purchase_date" v-model="asset_purchase_date" type="date"
                                placeholder="masukkan tanggal pembelian aset" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="classification_acquisition_value">Nilai Perolehan Aset</CFormLabel>
                            <CFormInput id="classification_acquisition_value" v-model="classification_acquisition_value"
                                type="number" placeholder="masukkan nilai perolehan" />
                        </div>

                        <div v-if="isAreaRequired" class="mb-4">
    <CFormLabel for="area_id">Pilih Area</CFormLabel>
    <select id="area_id" v-model="selectedArea"
        class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets">
        <option value="">Pilih Area</option>
        <option v-for="area in areas" :key="area.areaId" :value="area.areaId">
            {{ area.areaName }}
        </option>
    </select>
</div>

<div v-if="isOutletRequired" class="mb-4">
    <CFormLabel for="outlet_id">Pilih Lokasi</CFormLabel>
    <select id="outlet_id" v-model="selectedOutlet"
        class="border border-gray-300 rounded-lg p-2 w-full">
        <option value="">Pilih Lokasi</option>
        <option v-for="outlet in outlets" :key="outlet.outletId" :value="outlet.outletId">
            {{ outlet.outletName }}
        </option>
    </select>
</div>
                        <div v-if="isPicRequired" class="mb-4">
                            <CFormLabel for="asset_pic">Pilih PIC Aset</CFormLabel>
                            <select id="asset_pic" v-model="selectedPic"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets">
                                <option value="">Pilih PIC</option>
                                <option v-for="role in PicOption" :key="role.roleId" :value="role.roleId">
                                    {{ role.roleName }}
                                </option>
                            </select>
                        </div>

                        <div class="flex justify-end mt-4">
                            <button
                                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center"
                                @click.prevent="submitForm">Submit</button>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>

<script>
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const uploadUrl = import.meta.env.VITE_API_URL;

export default {
    data() {
        return {
            assetId: this.$route.params.id,
            asset_name: "",
            asset_brand: "",
            personal_responsible: "",
            asset_image: null,
            PicOption: [],
            selectedPic: "",
            selectedArea: "",
            selectedOutlet: "",
            selectedKlasifikasi: "",
            areas: [],
            outlets: [],
            klasifikasis: [],
            asset_purchase_date: "",
            asset_condition: '',
            asset_status: '',
            asset_pic: "",
            classification_acquisition_value: "",
            isAreaRequired: true,
            isOutletRequired: true,
            isKlasifikasiaRequired: true,
            isPicRequired: true,
        };
    },

    watch: {
        asset_condition(newValue) {
            console.log("Kondisi Aset Terpilih:", newValue);
        },
        asset_status(newValue) {
            console.log("Status Aset Terpilih:", newValue);
        },
    },

    created() {
        this.fetchAssetData();
        this.fetchAreas();
        this.fetchOutlets();
        this.fetchPic();
        this.fetchKlasifikasi();
        // this.fetchPersonal();
    },

    methods: {

        async fetchAssetData() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/api/assets/${this.assetId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200 && response.data && response.data.data) {
                    const assetData = response.data.data;

                    console.log("Asset Condition:", assetData.assetCondition);
                    console.log("Asset Status:", assetData.assetStatus);

                    this.asset_name = assetData.assetName || '';
                    this.asset_brand = assetData.assetBrand || '';
                    this.asset_specification = assetData.assetSpecification || '';
                    this.asset_condition = assetData.assetCondition || '';
                    this.asset_status = assetData.assetStatus || '';
                    this.asset_purchase_date = assetData.assetPurchaseDate
                        ? assetData.assetPurchaseDate.split("T")[0]
                        : '';
                    this.classification_acquisition_value = assetData.classificationAcquisitionValue || '';
                    this.selectedKlasifikasi = assetData.assetClassification || '';
                    this.personal_responsible = assetData.personalResponsible || '';
                    this.selectedArea = assetData.areaId || '';
                    this.selectedOutlet = assetData.outletId || '';
                    this.initializeExistingData(assetData);
                    this.oldFileName = assetData.assetImage;
                    this.selectedPic = assetData.assetPic || '';
                    this.assetName = aset.assetName || "Tidak tersedia";
                    this.oldFileName = aset.assetImage ? aset.assetImage.split('/').pop() : null;

                    if (this.selectedArea) {
                        await this.fetchOutlets();
                    }
                }
            } catch (error) {
                console.error("Error fetching asset data:", error);
            }
        },

        fetchKlasifikasi() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/classifications", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Klasifikasi fetched:", response.data.data);
                    this.klasifikasis = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching klasifikasi:", error);
                    this.klasifikasis = [];
                });
        },

        fetchAreas() {
        const token = localStorage.getItem("token");
        axios
            .get(apiUrl + "/api/areas", { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                this.areas = response.data.data;

                if (this.selectedArea) {
                    const existingArea = this.areas.find(area => area.areaId === this.selectedArea);
                    if (!existingArea) this.selectedArea = "";
                }
            })
            .catch((error) => {
                console.error("Error fetching areas:", error);
                this.areas = [];
            });
    },
    fetchOutlets() {
        if (!this.selectedArea) return;
        const token = localStorage.getItem("token");
        axios
            .get(`${apiUrl}/api/outlets?area_id=${this.selectedArea}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                this.outlets = response.data.data;

                if (this.selectedOutlet) {
                    const existingOutlet = this.outlets.find(outlet => outlet.outletId === this.selectedOutlet);
                    if (!existingOutlet) this.selectedOutlet = ""; 
                }
            })
            .catch((error) => {
                console.error("Error fetching outlets:", error);
                this.outlets = [];
            });
    },
    initializeExistingData(apiResponse) {
        this.selectedArea = apiResponse.areaId;
        this.selectedOutlet = apiResponse.outletId;
        this.fetchAreas();
        this.fetchOutlets();
    },

        fetchPic() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/roles", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Fetched roles:", response.data.data);
                    this.PicOption = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching roles:", error);
                    this.PicOption = [];
                });
        },

        handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.asset_image = file; 
        }
    },


async submitForm() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
        return;
    }

    let uploadedFilePath = this.oldFileName;

    try {
            if (this.asset_image) { // Check if a new file is selected
                const imageFormData = new FormData();
                imageFormData.append("file", this.asset_image);

                // Pass the old file name to the backend
                if (this.oldFileName) {
                    imageFormData.append("oldFileName", this.oldFileName);
                }

                const uploadResponse = await axios.post(
                    uploadUrl + "/upload?module=Master%20Aset",
                    imageFormData,
                    {
                        headers: {
                            "X-API-KEY": "bprfjocmaqfib592338vf",
                        },
                    }
                );

                uploadedFilePath = uploadResponse.data.file_path;
                console.log("Uploaded file path:", uploadedFilePath);
            }

        const payload = {
            asset_name: this.asset_name,
            asset_brand: this.asset_brand,
            asset_image: uploadedFilePath, 
            asset_specification: this.asset_specification,
            asset_condition: this.asset_condition,
            asset_status: this.asset_status,
            asset_purchase_date: this.asset_purchase_date,
            classification_acquisition_value: this.classification_acquisition_value,
            asset_classification: this.selectedKlasifikasi,
            outlet_id: this.selectedOutlet,
            area_id: this.selectedArea,
            asset_pic: this.selectedPic,
            personal_responsible: this.personal_responsible,
        };

        const response = await axios.put(
            `${apiUrl}/api/assets/${this.assetId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            console.log("Asset updated successfully:", response.data);
            this.$router.push("/pages/asets");
        }
    } catch (error) {
        console.error("Error updating asset:", error);
    }
}


    },
};
</script>
