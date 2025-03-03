<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Detail Pengajuan Aset</strong>
                </CCardHeader>
                <CCardBody id="submissionDetails">
                    <!-- Loading Spinner -->
                    <div v-if="isLoading" class="flex justify-center items-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <!-- Form Data -->
                    <div v-else>
                        <CForm>
                            <div class="mb-3 flex items-center justify-between">
                                <div class="flex-1">
                                    <CFormLabel for="submissionDate">Tanggal Pengajuan</CFormLabel>
                                    <CFormInput id="submissionDate" v-model="submissionDate" type="text"
                                        placeholder="tanggal pengajuan auto value" readonly />
                                </div>
                                <div class="flex-1 ml-4">
                                    <CFormLabel for="submissionName">Nama Pengaju</CFormLabel>
                                    <CFormInput id="submissionName" v-model="submissionName" type="text"
                                        placeholder="nama pengaju auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3 flex items-center justify-between">
                                <div class="flex-1">
                                    <CFormLabel for="nip">NIP</CFormLabel>
                                    <CFormInput id="nip" v-model="nip" type="text" placeholder="NIP auto value"
                                        readonly />
                                </div>
                                <div class="flex-1 ml-4">
                                    <CFormLabel for="submissionPrName">Penanggung Jawab Aset/Pengguna</CFormLabel>
                                    <CFormInput id="submissionPrName" v-model="submissionPrName" type="text"
                                        placeholder="penanggung jawab aset auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3 flex items-center justify-between">
                                <div class="flex-1">
                                    <CFormLabel for="submissionAssetName">Nama Aset</CFormLabel>
                                    <CFormInput id="submissionAssetName" v-model="submissionAssetName" type="text"
                                        placeholder="nama aset auto value" readonly />
                                </div>
                                <div class="flex-1 ml-4">
                                    <CFormLabel for="submissionRoleName">PIC Aset</CFormLabel>
                                    <CFormInput id="submissionRoleName" v-model="submissionRoleName" type="text"
                                        placeholder="nama pic aset auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3 flex justify-between">
                                <div class="flex-1 mr-4">
                                    <CFormLabel for="submissionCategory">Kategori Pengajuan</CFormLabel>
                                    <CFormInput id="submissionCategory" v-model="submissionCategory" type="text"
                                        placeholder="nama kategori pengajuan auto value" readonly />
                                </div>
                                <div class="flex-1">
                                    <CFormLabel for="submissionOutlet">Lokasi</CFormLabel>
                                    <CFormInput id="submissionOutlet" v-model="submissionOutlet" type="text"
                                        placeholder="lokasi auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3 flex space-x-4">
                                <div class="flex-1 mr-4">
                                    <CFormLabel for="submissionArea">Area</CFormLabel>
                                    <CFormInput id="submissionArea" v-model="submissionArea" type="text"
                                        placeholder="area auto value" readonly />
                                </div>
                            </div>
                            <div v-if="submissionCategory !== 'Pengabaian Kondisi Aset'" class="mb-3 flex space-x-4">
                                <div class="flex-1 mr-4">
                                    <CFormLabel for="submissionQuantity">Jumlah</CFormLabel>
                                    <CFormInput id="submissionQuantity" :value="formatRupiah(submissionQuantity)" type="text"
                                        placeholder="jumlah auto value" readonly />
                                </div>
                                <div class="flex-1">
                                    <CFormLabel for="submissionPrice">Harga Satuan</CFormLabel>
                                    <CFormInput id="submissionPrice" :value="formatRupiah(submissionPrice)" type="text"
                                        placeholder="harga satuan auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="flex items-start">
                                    <!-- Image Section -->
                                    <div class="mr-4">
                                        <CFormLabel for="Image">Lampiran</CFormLabel>
                                        <div v-if="attachment">
                                            <img :src="attachment" alt="Lampiran Gambar" class="img-fluid"
                                                style="max-width: 400px; max-height: 400px;" />
                                        </div>
                                        <div v-else>
                                            <p>Tidak ada gambar</p>
                                        </div>
                                    </div>

                                    <!-- Description Section -->
                                    <div class="flex-1">
                                        <CFormLabel for="submissionDescription">Description</CFormLabel>
                                        <CFormTextarea id="submissionDescription" v-model="submissionDescription"
                                            placeholder="Deskripsi" readonly />
                                    </div>
                                </div>
                            </div>
                        </CForm>
                    </div>
                    <div class="flex space-x-2">
                        <button @click="downloadPDF"
                            class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">Download PDF</button>

                    </div>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>

<script>
import axios from "axios";
import html2pdf from "html2pdf.js";

const apiUrl = import.meta.env.VITE_API_URL;
const uploadUrl = import.meta.env.VITE_UPLOAD_URL;

export default {
    data() {
        return {
            isGeneratingPDF: false, // Default tidak tampil
            isLoading: true,
            submissionId: this.$route.params.submissionId,
            submissionAssetName: "",
            submissionOutlet: "",
            submissionDescription: "",
            submissionRoleName: "",
            submissionCategory: "",
            submissionName: "",
            submissionArea: "",
            submissionPrice: "",
            submissionQuantity: "", // Tambahkan ini
            submissionPrName: "",
            nip: "",
            submissionDate: "",
            attachment: "",
        };
    },

    mounted() {
        this.fetchSubmissionsData();
    },

    methods: {
        async fetchSubmissionsData() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                this.isLoading = false;
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/api/submissions/${this.submissionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response Data:", response.data);

                if (response.status === 200 && response.data.submission) {
                    const submissionData = response.data.submission;
                    this.submissionName = submissionData.submissionName || '';
                    this.submissionAssetName = submissionData.submissionAssetName || '';
                    this.submissionDescription = submissionData.submissionDescription || '';
                    this.submissionRoleName = submissionData.submissionRoleName || '';
                    this.submissionOutlet = submissionData.submissionOutlet || '';
                    this.submissionArea = submissionData.submissionArea || '';
                    this.nip = submissionData.nip || '';
                    this.submissionPrice = submissionData.submissionPrice || '';
                    this.submissionQuantity = submissionData.submissionQuantity || ''; // Tambahkan ini
                    this.submissionPrName = submissionData.submissionPrName || '';
                    this.submissionCategory = submissionData.submissionCategory || '';
                    const formattedDate = new Date(submissionData.submissionDate).toLocaleDateString();
                    this.submissionDate = formattedDate;
                    const attachment = submissionData.attachment || this.defaultImage;
                    const encodedSubmissionImagePath = encodeURIComponent(submissionData.attachment || this.defaultImage);
                    console.log("path:", encodedSubmissionImagePath);
                    axios.get(`${uploadUrl}/get-file?path=${encodedSubmissionImagePath}`, {
                        headers: { 'X-API-KEY': 'bprfjocmaqfib592338vf' },
                        responseType: 'arraybuffer',
                    })
                        .then((response) => {
                            console.log("response:", response);
                            const blob = new Blob([response.data], { type: 'image/jpeg' });
                            this.attachment = URL.createObjectURL(blob);
                        })
                        .catch((error) => {
                            console.error("Gagal mengambil gambar:", error);
                            this.attachment = this.defaultImage;
                        });
                } else {
                    console.error("Data submission tidak ditemukan atau request gagal.");
                }
            } catch (error) {
                console.error("Error fetching submissions data:", error);
            } finally {
                this.isLoading = false;
            }
        },
        formatRupiah(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        downloadPDF() {
            const formattedPrice = this.formatRupiah(this.submissionPrice);
            const totalAnggaran = this.formatRupiah(this.submissionQuantity * this.submissionPrice);
            const content = `
  <style>
            body { color: black; font-size: 12px; }
            h2 { color: black; text-align: center; margin-bottom: 20px; font-size: 16px; }
            p { color: black; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 2px; border: none; text-align: left; }
            .label { width: 30%; text-align: left; }
            .value { width: 70%; text-align: left; }
            .non-transparent-table { border: 1px solid black; }
            .non-transparent-table td { border: 1px solid black; padding: 4px; text-align: left; }
            .left-align { text-align: left; padding-left: 0; }
            .transparent-table { width: 100%; border-collapse: collapse; }
            .transparent-table td { padding: 4px; text-align: left; }
            .header-table { width: 100%; }
            .header-table td { vertical-align: middle; }
            .logo { width: 90px; height: auto; }
            .header-left, .header-right { width: 25%; }
            .header-center { width: 50%; text-align: center; }
        </style>
        <table class="header-table">
            <tr>
                <td class="header-left"></td>
                <td class="header-center"><h2>Form Pengajuan Aset</h2></td>
                <td class="header-right" style="text-align: right;"><img src="/logo ssb-remove.png" class="logo" alt="Logo"></td>
            </tr>
        </table>
        <table>
            <tr>
                <td class="label"><strong>Tanggal Pengajuan</strong></td>
                <td class="value">:${this.submissionDate}</td>
            </tr>
            <tr>
                <td class="label"><strong>Nama Pengaju</strong></td>
                <td class="value">:${this.submissionName}</td>
            </tr>
            <tr>
                <td class="label"><strong>PIC Aset</strong></td>
                <td class="value">:${this.submissionRoleName}</td>
            </tr>
            <tr>
                <td class="label"><strong>PJ/Pengguna Aset</strong></td>
                <td class="value">:${this.submissionPrName} - ${this.submissionOutlet}</td>
            </tr>
            <tr>
                <td class="label"><strong>Lokasi</strong></td>
                <td class="value">:${this.submissionOutlet}</td>
            </tr>
            <tr>
                <td class="label"><strong>Area</strong></td>
                <td class="value">:${this.submissionArea}</td>
            </tr>
            <tr>
                <td class="label"><strong>Kategori Pengajuan</strong></td>
                <td class="value">:${this.submissionCategory}</td>
            </tr>
            <tr>
                <td class="label"><strong>Keterangan</strong></td>
                <td class="value">:${this.submissionDescription}</td>
            </tr>
                        <tr>
                <td class="label"><strong>Sifat Pengajuan</strong></td>
                <td class="value">:Penting Segera / Penting Tidak Segera / Tidak Urgent</td>
            </tr>
        </table>
        <br>
        <table class="non-transparent-table">
            <tr>
                <td><strong>No</strong></td>
                <td><strong>Nama Aset</strong></td>
                <td><strong>Jumlah Kebutuhan</strong></td>
                <td><strong>Harga Satuan</strong></td>
                <td><strong>Total Anggaran</strong></td>
            </tr>
            <tr>
                <td>1.</td>
                <td>${this.submissionAssetName}</td>
                <td>${this.submissionQuantity}</td>
                <td>${formattedPrice}</td>
                <td>${totalAnggaran}</td>
            </tr>
        </table>
        <br>
        <table class="non-transparent-table">
            <tr>
                <td><strong>Dibuat oleh</strong></td>
                <td><strong>Diketahui oleh</strong></td>
                <td><strong>Diketahui oleh</strong></td>
                <td colspan="2"><strong>Disetujui oleh</strong></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td><strong>Keuangan</strong></td>
                <td><strong>Direktur</strong></td>
            </tr>
            <tr>
                <td class="left-align"><strong>Tgl</strong></td>
                <td class="left-align"><strong>Tgl</strong></td>
                <td class="left-align"><strong>Tgl</strong></td>
                <td class="left-align"><strong>Tgl</strong></td>
                <td class="left-align"><strong>Tgl</strong></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="height: 50px;"></td>
                <td style="height: 50px;"></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><strong>Hj. Hesti Noviasari</strong></td>
            </tr>
        </table>
        <br>
        <table class="transparent-table">
            <tr>
                <td><strong>Tujuan Pembayaran</strong></td>
                <td></td>
            </tr>
            <tr>
                <td> - Nomor Rekening:</td>
                <td></td>
            </tr>
            <tr>
                <td> - Nama Bank:</td>
                <td></td>
            </tr>
            <tr>
                <td> - Atas Nama:</td>
                <td></td>
            </tr>
        </table>
        <br>
        <table class="transparent-table">
            <tr>
                <td><strong>Lampiran :</strong></td>
                <td></td>
            </tr>
            <tr>
                <td><strong>Telah ada dalam budget Divisi/Departement/Outlet / ............................ / Belum ada dalam budget</strong></td>
                <td></td>
            </tr>
        </table>
        <br>
        <table class="transparent-table">
            <tr>
                <td><strong>Diisi oleh keuangan : </strong> Diterima Lengkap Tanggal .......................</td>
                <td></td>
            </tr>
        </table>
    `;

            const element = document.createElement("div");
            element.innerHTML = content;

            html2pdf()
                .from(element)
                .set({
                    margin: 14,
                    filename: `Detail_Pengajuan_${this.submissionCategory}-${this.submissionId}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { orientation: "portrait", unit: "mm", format: "a4", compressPDF: true }
                })
                .save();
        }
    }
};
</script>