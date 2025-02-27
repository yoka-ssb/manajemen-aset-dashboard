<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader class="d-flex justify-content-between">
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
                        <div v-for="(submission, index) in submissions" :key="submission.submissionId">
                            <strong>Detail Pengajuan Aset {{ index + 1 }}</strong>
                            <hr />

                            <CForm>
                                <div class="mb-3 flex items-center justify-between">
                                    <div class="flex-1">
                                        <CFormLabel for="submissionDate">Tanggal Pengajuan</CFormLabel>
                                        <CFormInput id="submissionDate" v-model="submission.submissionDate" type="text"
                                            placeholder="tanggal pengajuan auto value" readonly />
                                    </div>
                                    <div class="flex-1 ml-4">
                                        <CFormLabel for="submissionName">Nama Pengaju</CFormLabel>
                                        <CFormInput id="submissionName" v-model="submission.submissionName" type="text"
                                            placeholder="nama pengaju auto value" readonly />
                                    </div>
                                </div>
                                <div class="mb-3 flex items-center justify-between">
                                    <div class="flex-1">
                                        <CFormLabel for="nip">NIP</CFormLabel>
                                        <CFormInput id="nip" v-model="submission.nip" type="text"
                                            placeholder="NIP auto value" readonly />
                                    </div>
                                    <div class="flex-1 ml-4">
                                        <CFormLabel for="submissionPrName">Penanggung Jawab Aset/Pengguna</CFormLabel>
                                        <CFormInput id="submissionPrName" v-model="submission.submissionPrName"
                                            type="text" placeholder="penanggung jawab aset auto value" readonly />
                                    </div>
                                </div>
                                <div class="mb-3 flex items-center justify-between">
                                    <div class="flex-1">
                                        <CFormLabel for="submissionAssetName">Nama Aset</CFormLabel>
                                        <CFormInput id="submissionAssetName" v-model="submission.submissionAssetName"
                                            type="text" placeholder="nama aset auto value" readonly />
                                    </div>
                                    <div class="flex-1 ml-4">
                                        <CFormLabel for="submissionRoleName">PIC Aset</CFormLabel>
                                        <CFormInput id="submissionRoleName" v-model="submission.submissionRoleName"
                                            type="text" placeholder="nama pic aset auto value" readonly />
                                    </div>
                                </div>
                                <div class="mb-3 flex justify-between">
                                    <div class="flex-1 mr-4">
                                        <CFormLabel for="submissionCategory">Kategori Pengajuan</CFormLabel>
                                        <CFormInput id="submissionCategory" v-model="submission.submissionCategory"
                                            type="text" placeholder="nama kategori pengajuan auto value" readonly />
                                    </div>
                                    <div class="flex-1">
                                        <CFormLabel for="submissionOutlet">Lokasi</CFormLabel>
                                        <CFormInput id="submissionOutlet" v-model="submission.submissionOutlet"
                                            type="text" placeholder="lokasi auto value" readonly />
                                    </div>
                                </div>
                                <div class="mb-3 flex space-x-4">
                                    <div class="flex-1 mr-4">
                                        <CFormLabel for="submissionArea">Area</CFormLabel>
                                        <CFormInput id="submissionArea" v-model="submission.submissionArea" type="text"
                                            placeholder="area auto value" readonly />
                                    </div>
                                </div>
                                <div v-if="submission.submissionCategory !== 'Pengabaian Kondisi Aset'"
                                    class="mb-3 flex space-x-4">
                                    <div class="flex-1 mr-4">
                                        <CFormLabel for="submissionQuantity">Jumlah</CFormLabel>
                                        <CFormInput id="submissionQuantity"
                                            :value="formatRupiah(submission.submissionQuantity)" type="text"
                                            placeholder="jumlah auto value" readonly />
                                    </div>
                                    <div class="flex-1">
                                        <CFormLabel for="submissionPrice">Harga Satuan</CFormLabel>
                                        <CFormInput id="submissionPrice"
                                            :value="formatRupiah(submission.submissionPrice)" type="text"
                                            placeholder="harga satuan auto value" readonly />
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <div class="flex items-start">
                                        <!-- Image Section -->
                                        <div class="mr-4">
                                            <CFormLabel for="Image">Lampiran</CFormLabel>
                                            <div v-if="submission.attachment">
                                                <img :src="submission.attachment" alt="Lampiran Gambar"
                                                    class="img-fluid" style="max-width: 400px; max-height: 400px;" />
                                            </div>
                                            <div v-else>
                                                <p>Tidak ada gambar</p>
                                            </div>
                                        </div>

                                        <!-- Description Section -->
                                        <div class="flex-1">
                                            <CFormLabel for="submissionDescription">Description</CFormLabel>
                                            <CFormTextarea id="submissionDescription"
                                                v-model="submission.submissionDescription" placeholder="Deskripsi"
                                                readonly />
                                        </div>
                                    </div>
                                </div>
                            </CForm>
                        </div>
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
            submissions: [],
            page: 1,
            pageSize: 10,
        };
    },

    mounted() {
        this.fetchSubmissionsData();
        console.log(this.submissions);
    },

    methods: {
        async parseToken() {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwt_decode(token);
                this.role_id = decoded.role_id;
                this.outlet_id = decoded.outlet_id;
                this.area_id = decoded.area_id;
                console.log('Role ID:', this.role_id);
                console.log('Outlet ID:', this.outlet_id);
                console.log('Area ID:', this.area_id);
            } else {
                console.error('Token not found in local storage');
            }
        },
        async fetchSubmissionsData() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                this.isLoading = false;
                return;
            }

            const submissionParentId = this.$route.params.submissionParentId;

            try {
                const response = await axios.get(`${apiUrl}/api/submissions`, {
                    params: {
                        page_number: this.page,
                        page_size: this.pageSize,
                        outlet_id: this.outlet_id,
                        area_id: this.area_id,
                        submission_parent_id: submissionParentId,
                        parent_id: true
                    },
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response Data:", response.data);

                if (response.status === 200 && response.data.data) {
                    this.submissions = await Promise.all(response.data.data.map(async submission => {
                        const formattedDate = new Date(submission.submissionDate).toLocaleDateString();
                        const encodedSubmissionImagePath = encodeURIComponent(submission.attachment || this.defaultImage);
                        let attachmentUrl = this.defaultImage;

                        if (submission.attachment) {
                            try {
                                const attachmentResponse = await axios.get(`${uploadUrl}/get-file?path=${encodedSubmissionImagePath}`, {
                                    headers: { 'X-API-KEY': 'bprfjocmaqfib592338vf' },
                                    responseType: 'arraybuffer',
                                });
                                const blob = new Blob([attachmentResponse.data], { type: 'image/jpeg' });
                                attachmentUrl = URL.createObjectURL(blob);
                            } catch (error) {
                                console.error("Gagal mengambil gambar:", error);
                            }
                        }

                        return {
                            ...submission,
                            submissionDate: formattedDate,
                            attachment: attachmentUrl
                        };
                    }));
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
            console.log("Download PDF on click");
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
            .submission-header { margin-top: 20px; font-weight: bold; }
            .indented { padding-left: 20px; }
        </style>
        <table class="header-table">
            <tr>
                <td class="header-left"></td>
                <td class="header-center"><h2>Form Pengajuan Aset</h2></td>
                <td class="header-right" style="text-align: right;"><img src="/logo ssb-remove.png" class="logo" alt="Logo"></td>
            </tr>
        </table>
        ${this.submissions.map((submission, index) => `
            <div class="submission-header">Pengajuan ${index + 1}</div>
            <table>
                <tr>
                    <td class="label"><strong>Tanggal Pengajuan</strong></td>
                    <td class="value">:${submission.submissionDate}</td>
                </tr>
                <tr>
                    <td class="label"><strong>Nama Pengaju</strong></td>
                    <td class="value">:${submission.submissionName}</td>
                </tr>
                <tr>
                    <td class="label"><strong>PIC Aset</strong></td>
                    <td class="value">:${submission.submissionRoleName}</td>
                </tr>
                <tr>
                    <td class="label"><strong>PJ/Pengguna Aset</strong></td>
                    <td class="value">:${submission.submissionPrName} - ${submission.submissionOutlet}</td>
                </tr>
                <tr>
                    <td class="label"><strong>Lokasi</strong></td>
                    <td class="value">:${submission.submissionOutlet}</td>
                </tr>
                <tr>
                    <td class="label"><strong>Area</strong></td>
                    <td class="value">:${submission.submissionArea}</td>
                </tr>
                <tr>
                    <td class="label"><strong>Kategori Pengajuan</strong></td>
                    <td class="value">:${submission.submissionCategory}</td>
                </tr>
                <tr>
                    <td class="label"><strong>Keterangan</strong></td>
                    <td class="value">:${submission.submissionDescription}</td>
                </tr>
                <tr>
                    <td class="label"><strong>Sifat Pengajuan</strong></td>
                    <td class="value">:Penting Segera / Penting Tidak Segera / Tidak Urgent</td>
                </tr>
                <tr>
                    <td class="label indented"><strong>- Nama Aset</strong></td>
                    <td class="value indented">:${submission.submissionAssetName}</td>
                </tr>
                <tr>
                    <td class="label indented"><strong>- Jumlah Kebutuhan</strong></td>
                    <td class="value indented">:${submission.submissionQuantity}</td>
                </tr>
                <tr>
                    <td class="label indented"><strong>- Harga Satuan</strong></td>
                    <td class="value indented">:${this.formatRupiah(submission.submissionPrice)}</td>
                </tr>
                <tr>
                    <td class="label indented"><strong>- Total Anggaran</strong></td>
                    <td class="value indented">:${this.formatRupiah(submission.submissionQuantity * submission.submissionPrice)}</td>
                </tr>
            </table>
            <br>
        `).join('')}
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
                    filename: `Detail_Pengajuan_Aset.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { orientation: "portrait", unit: "mm", format: "a4", compressPDF: true }
                })
                .save();
        }
    }
};
</script>