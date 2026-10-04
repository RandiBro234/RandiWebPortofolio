// Semua teks konten website ada di file ini agar mudah diedit.

export const profile = {
  name: "Randi Nandika Danendra",
  firstName: "Randi",
  role: "Data Scientist",
  tagline:
    "Saya mengubah tabel yang berantakan menjadi keputusan yang masuk akal.",
  bio: "Mahasiswa D4 Sains Data Terapan PENS, semester 5. Berpengalaman membangun solusi data end-to-end: data cleaning, EDA, feature engineering, model machine learning, sampai deployment ke production dengan Python, SQL, dan REST API.",
  location: "Surabaya, Jawa Timur, Indonesia",
  email: "randizelda30@gmail.com",
  whatsapp: "+62 819-957-3818",
  whatsappLink: "https://wa.me/628199573818",
  github: "https://github.com/RandiBro234",
  linkedin: "https://www.linkedin.com/in/randi-nandika-danendra/",
  cvPath: "/assets/CV_Randi_Nandika_Danendra.pdf",
  portrait: "/assets/randi-cutout.png",
};

// Kalimat dengan kata kerja berganti otomatis (typewriter), merujuk ke 3 proyek nyata.
export const rotatingPhrases = [
  "yang memprediksi kerusakan mesin",
  "yang merekomendasikan distribusi tenaga kesehatan",
  "yang memprediksi hujan besok",
  "yang menilai jawaban wawancara secara otomatis",
  "yang mendeteksi anomali kualitas udara",
];

export const hero = {
  // Baris kecil di atas teks raksasa.
  sapaan: "Halo, saya Randi, mahasiswa Sains Data Terapan yang tertarik pada analisis data dan machine learning.",
  // Dua baris teks raksasa (lebar disejajarkan oleh <FitText />).
  lineSolid: "DATA ENTHUSIAST",
  lineOutline: "TURNING DATA INTO INSIGHT",
  // Anotasi gaya chart (fakta nyata saja).
  anotasi: [
    "Python · SQL",
    "Semester 5 · PENS",
    "F1 80% · FaultSense",
    "5 proyek",
  ],
  // Baris peran dengan efek typewriter.
  peran: {
    prefix: "> open_to_internship:",
    roles: ["Data Scientist", "Data Analyst", "Data Engineer"],
  },
  // Chip data ringkas, posisi menepi.
  chips: ["df.head()", "SELECT *", "model.fit()"],
  ctaPrimary: "Lihat Projek",
  ctaSecondary: "Hubungi Saya",
};

// Section identitas (kartu gaya editor kode).
export const identity = {
  eyebrow: "IDENTITAS",
  filename: "randi.profile",
  rows: [
    { key: "nama:", type: "name", value: "Randi Nandika Danendra" },
    { key: "studi:", type: "study", value: "D4 Sains Data Terapan", sub: "Politeknik Elektronika Negeri Surabaya" },
    { key: "domisili:", type: "location", value: "Surabaya" },
    { key: "peran:", type: "roles", roles: ["Data Scientist", "AI Engineer"] },
  ],
};

// Alur scrollytelling: dari data mentah ke insight.
export const journey = {
  eyebrow: "Alur Kerja",
  title: "Dari Data Mentah Jadi Sebuah",
  titleAccent: "Insight",
  subtitle:
    "Setiap proyek saya mulai dari data yang masih berantakan, lalu saya olah tahap demi tahap sampai menjadi insight yang bisa dipakai untuk mengambil keputusan.",
  stages: [
    {
      no: "01",
      key: "question",
      title: "Pertanyaan",
      narrative:
        "Semua analisis dimulai dari masalah yang jelas. Sebelum menyentuh data, saya tentukan keputusan apa yang ingin dibantu.",
      exampleLabel: "Contoh Pertanyaan",
      examples: [
        { text: "Kapan mesin akan rusak?", project: "FaultSense", slug: "faultsense" },
        { text: "Provinsi mana yang diprioritaskan?", project: "MedDistrib", slug: "meddistrib" },
        { text: "Apakah besok hujan?", project: "AustraliaRainPrediction", slug: "australia-rain-prediction" },
      ],
      visual: "question",
    },
    {
      no: "02",
      key: "raw",
      title: "Data Mentah",
      narrative:
        "Data nyata itu kotor: ada yang kosong, ganda, dan tidak konsisten. Ini titik awal yang jujur dari hampir setiap proyek.",
      exampleLabel: "Contoh Data",
      examples: [
        { text: "Data tenaga kesehatan tiap provinsi.", project: "MedDistrib", slug: "meddistrib" },
      ],
      visual: "raw",
    },
    {
      no: "03",
      key: "clean",
      title: "Pembersihan & ETL",
      narrative:
        "Merapikan data dan membangun pipeline yang bisa diulang: menangani nilai kosong, menyelaraskan tipe, dan menyiapkan fitur yang bersih sebelum dipakai model.",
      exampleLabel: "Contoh Pembersihan",
      examples: [
        { text: "Preprocessing dan feature engineering data cuaca WeatherAUS.", project: "AustraliaRainPrediction", slug: "australia-rain-prediction" },
        { text: "Text mining Bahasa Indonesia.", project: "JobifyAI", slug: "jobifyai" },
      ],
      visual: "clean",
    },
    {
      no: "04",
      key: "eda",
      title: "Eksplorasi (EDA)",
      narrative:
        "Mencari pola, korelasi, dan anomali. Grafik muncul satu per satu sampai bentuk masalahnya mulai terlihat.",
      exampleLabel: "Contoh Eksplorasi",
      examples: [
        { text: "EDA data cuaca WeatherAUS.", project: "AustraliaRainPrediction", slug: "australia-rain-prediction" },
        { text: "Deteksi anomali kualitas udara dengan Isolation Forest.", project: "AIRWISE", slug: "airwise" },
      ],
      visual: "eda",
    },
    {
      no: "05",
      key: "model",
      title: "Pemodelan",
      narrative:
        "Feature engineering, pemilihan model, dan evaluasi. Saya tidak berhenti di satu algoritma tanpa membandingkannya.",
      exampleLabel: "Contoh Pemodelan",
      examples: [
        { text: "Perbandingan CatBoost, XGBoost, Linear Regression, dan Random Forest, lalu hyperparameter tuning dan optimasi threshold.", project: "AustraliaRainPrediction", slug: "australia-rain-prediction" },
      ],
      visual: "model",
    },
    {
      no: "06",
      key: "insight",
      title: "Insight & Keputusan",
      narrative:
        "Hasil diterjemahkan jadi rekomendasi yang bisa ditindaklanjuti, bukan sekadar angka di laporan.",
      exampleLabel: "Contoh Insight",
      examples: [
        { text: "Skor prioritas distribusi tenaga kesehatan.", project: "MedDistrib", slug: "meddistrib" },
      ],
      visual: "insight",
    },
    {
      no: "07",
      key: "deploy",
      title: "Deployment",
      narrative:
        "Model dipakai nyata lewat API, Docker, dan tracking eksperimen MLflow supaya hasilnya bisa diandalkan.",
      exampleLabel: "Contoh Deployment",
      examples: [
        { text: "FastAPI, Docker, dan MLflow.", project: "FaultSense", slug: "faultsense" },
        { text: "Dashboard rekomendasi yang live di Vercel.", project: "MedDistrib", slug: "meddistrib" },
      ],
      visual: "deploy",
    },
  ],
};

export const projectsSection = {
  eyebrow: "Studi Kasus",
  title: "Projek",
  titleAccent: "",
  subtitle:
    "Lima proyek, dari prediksi kerusakan mesin sampai pemantauan kualitas udara. Pilih proyek untuk melihat detailnya.",
};

// Placeholder untuk data yang belum diketahui; ditampilkan sebagai chip "Segera diisi".
export const PLACEHOLDER = "[ISI: ...]";

// Struktur cerita tiap studi kasus. Detail yang belum ada memakai placeholder [ISI: ...].
export const projects = [
  {
    id: "faultsense",
    slug: "faultsense",
    title: "FaultSense",
    name: "FaultSense",
    role: "Machine Learning Engineer",
    context: "Project Based Learning",
    period: "Maret–Juni 2026",
    categories: ["Machine Learning", "Deployment"],
    summary:
      "Prediksi kondisi mesin sebelum rusak (predictive maintenance) lewat model Cascade Random Forest.",
    question:
      "Bagaimana memprediksi kondisi mesin sebelum rusak (predictive maintenance)?",
    approach: [
      "Model Cascade Random Forest.",
      "Backend REST API FastAPI terhubung ke PostgreSQL.",
      "Tracking eksperimen dengan MLflow.",
      "Containerization dengan Docker.",
    ],
    result: "F1-score 80%",
    tools: ["Python", "Scikit-learn", "FastAPI", "PostgreSQL", "MLflow", "Docker"],
    githubUrl: "https://github.com/RandiBro234/FaultSense",
    demoUrl: "https://faultsense.vercel.app/",
    story: {
      pertanyaan:
        "Bagaimana memprediksi kondisi mesin sebelum rusak (predictive maintenance)?",
      data: "[ISI: sumber/jumlah data]",
      pendekatan:
        "Model Cascade Random Forest; backend REST API dengan FastAPI yang terhubung ke database PostgreSQL; tracking eksperimen dengan MLflow; containerization dengan Docker.",
      hasil: "F1-score 80%.",
      dampak: "[ISI: dampak/insight utama]",
    },
    accent: true,
  },
  {
    id: "meddistrib",
    slug: "meddistrib",
    title: "MedDistrib",
    name: "MedDistrib",
    role: "Data Scientist",
    context: "Sistem Rekomendasi",
    period: "Mei–Juni 2026",
    categories: ["Sistem Rekomendasi"],
    summary:
      "Sistem rekomendasi hybrid untuk memprioritaskan distribusi tenaga kesehatan antar wilayah.",
    question:
      "Provinsi mana yang paling perlu diprioritaskan dalam distribusi tenaga kesehatan?",
    approach: [
      "Sistem rekomendasi hybrid (Knowledge-Based Scoring + Content-Based Filtering).",
      "Hasil ditampilkan di dashboard analitik yang memvisualisasikan wilayah prioritas berdasarkan karakteristik kesehatan.",
    ],
    result: null,
    tools: ["Python", "Pandas", "Content-Based Filtering", "Dashboard Analytics"],
    githubUrl: "https://github.com/RandiBro234/MedDistrib",
    demoUrl: "https://med-distrib.vercel.app/",
    story: {
      pertanyaan:
        "Provinsi mana yang paling perlu diprioritaskan dalam distribusi tenaga kesehatan?",
      data: "[ISI: sumber data]",
      pendekatan:
        "Sistem rekomendasi hybrid (Knowledge-Based Scoring + Content-Based Filtering), hasilnya ditampilkan di dashboard analitik yang memvisualisasikan wilayah prioritas berdasarkan karakteristik kesehatan.",
      hasil: "[ISI: temuan utama]",
      dampak:
        "Rekomendasi wilayah prioritas ditampilkan dalam dashboard yang bisa ditindaklanjuti.",
    },
    accent: false,
  },
  {
    id: "australia-rain-prediction",
    slug: "australia-rain-prediction",
    title: "AustraliaRainPrediction",
    name: "AustraliaRainPrediction",
    role: "Data Scientist",
    context: "Machine Learning",
    period: "Juli 2026",
    categories: ["Machine Learning"],
    summary:
      "Projek machine learning end-to-end untuk memprediksi hujan besok memakai dataset WeatherAUS.",
    question:
      "Apakah besok akan hujan di Australia, berdasarkan data cuaca hari ini?",
    approach: [
      "EDA dan preprocessing data cuaca WeatherAUS.",
      "Feature engineering.",
      "Perbandingan model: CatBoost, XGBoost, Linear Regression, Random Forest.",
      "Hyperparameter tuning dan optimasi threshold.",
    ],
    result: "[ISI: model terbaik dan metriknya]",
    tools: ["Python", "CatBoost", "XGBoost", "Scikit-learn", "Random Forest", "Pandas"],
    githubUrl: "https://github.com/RandiBro234/AustraliaRainPrediction",
    story: {
      pertanyaan:
        "Apakah besok akan hujan di Australia, berdasarkan data cuaca hari ini?",
      data: "[ISI: sumber/ukuran data WeatherAUS]",
      pendekatan:
        "EDA → preprocessing → feature engineering → perbandingan model (CatBoost, XGBoost, Linear Regression, Random Forest) → hyperparameter tuning → optimasi threshold.",
      hasil: "[ISI: model terbaik dan metriknya]",
      dampak: "[ISI: fitur paling berpengaruh]",
    },
    accent: false,
  },
  {
    id: "jobifyai",
    slug: "jobifyai",
    title: "JobifyAI",
    name: "JobifyAI",
    role: "Full Stack Developer",
    context: "NLP",
    period: "September–November 2025",
    categories: ["NLP"],
    summary:
      "Aplikasi simulasi wawancara kerja berbasis Flask yang menilai jawaban secara otomatis menggunakan TF-IDF, cosine similarity, dan text mining Bahasa Indonesia.",
    question:
      "Bagaimana pencari kerja bisa berlatih wawancara dan langsung mendapat penilaian jawaban secara otomatis?",
    approach: [
      "Text mining Bahasa Indonesia.",
      "Representasi teks dengan TF-IDF.",
      "Penilaian kemiripan jawaban dengan cosine similarity.",
      "Dibungkus aplikasi web Flask.",
    ],
    result: "[ISI: hasil, mis. akurasi atau jumlah pertanyaan]",
    tools: ["Python", "Flask", "TF-IDF", "Cosine Similarity", "Text Mining"],
    githubUrl: "https://github.com/RandiBro234/JobifyAI",
    story: {
      pertanyaan:
        "Bagaimana pencari kerja bisa berlatih wawancara dan langsung mendapat penilaian jawaban secara otomatis?",
      data: "[ISI: sumber/ukuran data pertanyaan dan jawaban]",
      pendekatan:
        "Text mining Bahasa Indonesia, representasi teks dengan TF-IDF, penilaian kemiripan jawaban dengan cosine similarity, dibungkus aplikasi web Flask.",
      hasil: "[ISI: hasil, mis. akurasi atau jumlah pertanyaan]",
      dampak: "[ISI: dampak]",
    },
    accent: false,
  },
  {
    id: "airwise",
    slug: "airwise",
    title: "AIRWISE",
    name: "AIRWISE",
    role: "Full Stack Developer",
    context: "Monitoring",
    period: "Juni–Juli 2026",
    categories: ["Machine Learning", "Monitoring"],
    summary:
      "Platform pemantauan kualitas udara real-time dengan deteksi anomali berbasis AI (Isolation Forest) untuk memberikan saran kesehatan yang cerdas.",
    question:
      "Bagaimana mendeteksi kualitas udara yang tidak wajar secara real-time dan menerjemahkannya menjadi saran kesehatan?",
    approach: [
      "Pemantauan data kualitas udara real-time.",
      "Deteksi anomali dengan Isolation Forest.",
      "Saran kesehatan (health advisory) berdasarkan hasil deteksi.",
    ],
    result: "[ISI: hasil]",
    tools: ["Python", "Isolation Forest", "Scikit-learn", "[ISI: tools lain]"],
    githubUrl: "https://github.com/RandiBro234/AIRWISE",
    story: {
      pertanyaan:
        "Bagaimana mendeteksi kualitas udara yang tidak wajar secara real-time dan menerjemahkannya menjadi saran kesehatan?",
      data: "[ISI: sumber data kualitas udara]",
      pendekatan:
        "Pemantauan data kualitas udara real-time, deteksi anomali dengan Isolation Forest, saran kesehatan (health advisory) berdasarkan hasil deteksi.",
      hasil: "[ISI: hasil]",
      dampak: "[ISI: dampak]",
    },
    accent: false,
  },
];

export const services = {
  eyebrow: "Kemampuan",
  title: "Apa yang Saya",
  titleAccent: "Kerjakan",
  subtitle:
    "Fokus utama saya adalah Data Scientist, dengan kemampuan pendukung di analisis data dan data engineering agar solusinya bisa jalan end-to-end.",
  cards: [
    {
      no: "01",
      title: "Analisis Data & Dashboard",
      desc: "Data cleaning, EDA, dan dashboard interaktif dengan Power BI, Tableau, atau Python.",
      tools: ["EDA", "Data Cleaning", "Power BI", "Tableau"],
      featured: false,
      visual: "analysis",
      to: "/tools",
    },
    {
      no: "02",
      title: "Machine Learning & Prediksi",
      desc: "Klasifikasi, sistem rekomendasi, NLP, deteksi anomali, perbandingan dan tuning model (CatBoost, XGBoost, Random Forest), optimasi threshold, evaluasi dengan Scikit-learn.",
      tools: ["Klasifikasi", "NLP", "Anomali", "CatBoost", "XGBoost", "Scikit-learn"],
      featured: true,
      visual: "ml",
      to: "/proyek",
    },
    {
      no: "03",
      title: "Data Engineering & Deployment",
      desc: "REST API FastAPI, Docker, MLflow, dan PostgreSQL untuk membawa model ke produksi.",
      tools: ["FastAPI", "Docker", "MLflow", "PostgreSQL"],
      featured: false,
      visual: "deploy",
      to: "/proyek",
    },
  ],
};

export const timeline = {
  eyebrow: "Perjalanan",
  title: "Pendidikan &",
  titleAccent: "Pengalaman",
  subtitle:
    "Perjalanan saya belajar menjadi data scientist, dari bangku kuliah sampai proyek nyata.",
  items: [
    {
      type: "education",
      period: "Sep 2024 – Sekarang",
      title: "Politeknik Elektronika Negeri Surabaya (PENS)",
      subtitle: "D4 Sains Data Terapan",
      badge: "Semester 5",
      desc: "Fokus: Machine Learning Operations, Artificial Intelligence, Basis Data, Pemodelan Statistika.",
      detail:
        "Menempuh D4 Sains Data Terapan, sekarang di semester 5. Mata kuliah yang relevan: Machine Learning Operations, Artificial Intelligence, Basis Data, dan Pemodelan Statistika. Projek kuliah dikerjakan end-to-end, dari pengolahan data sampai evaluasi model.",
    },
    {
      type: "work",
      period: "September–November 2025",
      title: "Full Stack Developer",
      subtitle: "JobifyAI",
      projectSlug: "jobifyai",
      desc: "Aplikasi simulasi wawancara kerja berbasis Flask dengan penilaian jawaban otomatis (TF-IDF + cosine similarity, text mining Bahasa Indonesia).",
      detail:
        "Aplikasi simulasi wawancara kerja: jawaban dinilai otomatis lewat text mining Bahasa Indonesia, representasi TF-IDF, dan kemiripan cosine similarity, dibungkus sebagai aplikasi web Flask.",
    },
    {
      type: "work",
      period: "Mar–Jun 2026",
      title: "Machine Learning Engineer",
      subtitle: "FaultSense",
      projectSlug: "faultsense",
      desc: "Predictive maintenance dengan Cascade Random Forest, FastAPI, PostgreSQL, MLflow, dan Docker.",
      detail:
        "Membangun model Cascade Random Forest untuk memprediksi kondisi mesin sebelum rusak, lalu membungkusnya jadi REST API dengan FastAPI yang terhubung ke PostgreSQL. Eksperimen dilacak pakai MLflow dan dijalankan lewat Docker.",
    },
    {
      type: "work",
      period: "Mei–Jun 2026",
      title: "Data Scientist",
      subtitle: "MedDistrib",
      projectSlug: "meddistrib",
      desc: "Sistem rekomendasi hybrid untuk prioritas distribusi tenaga kesehatan.",
      detail:
        "Menyusun sistem rekomendasi hybrid (Knowledge-Based Scoring + Content-Based Filtering) untuk menentukan wilayah prioritas distribusi tenaga kesehatan, dan menampilkannya di dashboard analitik.",
    },
    {
      type: "work",
      period: "Jul 2026",
      title: "Data Scientist",
      subtitle: "AustraliaRainPrediction",
      projectSlug: "australia-rain-prediction",
      desc: "Prediksi hujan besok dari data WeatherAUS: EDA, preprocessing, feature engineering, dan perbandingan model CatBoost, XGBoost, Random Forest.",
      detail:
        "Projek machine learning end-to-end: EDA dan preprocessing data cuaca WeatherAUS, feature engineering, lalu perbandingan model CatBoost, XGBoost, Linear Regression, dan Random Forest dengan hyperparameter tuning serta optimasi threshold.",
    },
    {
      type: "work",
      period: "Juni–Juli 2026",
      title: "Full Stack Developer",
      subtitle: "AIRWISE",
      projectSlug: "airwise",
      desc: "Platform pemantauan kualitas udara real-time dengan deteksi anomali Isolation Forest dan saran kesehatan.",
      detail:
        "Platform pemantauan kualitas udara real-time. Deteksi anomali memakai Isolation Forest, lalu hasilnya diterjemahkan menjadi saran kesehatan (health advisory).",
    },
    {
      type: "current",
      period: "Sekarang",
      title: "Mencari kesempatan magang",
      subtitle: "Data Scientist",
      desc: "Sedang mencari tempat magang sebagai Data Scientist.",
      detail:
        "Terbuka untuk magang Data Scientist (juga Data Analyst/Data Engineer). Domisili Surabaya. Lihat halaman Kontak untuk detail.",
    },
  ],
};

export const toolkit = {
  eyebrow: "Toolkit",
  title: "Skill &",
  titleAccent: "Alat",
  marquee: [
    "Python",
    "SQL",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "SARIMA",
    "TBATS",
    "PostgreSQL",
    "MySQL",
    "Pentaho",
    "FastAPI",
    "Flask",
    "Docker",
    "MLflow",
    "Power BI",
    "Tableau",
    "TF-IDF",
    "Cosine Similarity",
    "Text Mining",
    "Isolation Forest",
  ],
  groups: [
    {
      label: "Programming & Query",
      items: ["Python", "SQL"],
    },
    {
      label: "Analisis Data",
      items: [
        "Pandas",
        "NumPy",
        "Data Cleaning",
        "Preprocessing",
        "Feature Engineering",
        "EDA",
      ],
    },
    {
      label: "Machine Learning",
      items: [
        "Klasifikasi",
        "Regresi",
        "Sistem Rekomendasi",
        "Forecasting (SARIMA, TBATS)",
        "CatBoost",
        "XGBoost",
        "Isolation Forest",
        "Scikit-learn",
        "Evaluasi Model",
      ],
    },
    {
      label: "NLP & Text Mining",
      items: ["TF-IDF", "Cosine Similarity", "Text Mining"],
    },
    {
      label: "Visualisasi Data",
      items: ["Power BI", "Tableau", "Dashboard Analytics"],
    },
    {
      label: "Database",
      items: ["PostgreSQL", "MySQL"],
    },
    {
      label: "AI Deployment & Tools",
      items: ["FastAPI", "Flask", "Docker", "MLflow"],
    },
  ],
};

// Alur toolkit untuk ilustrasi halaman Tools.
export const toolPipeline = [
  "Python",
  "Pandas",
  "Scikit-learn",
  "CatBoost",
  "XGBoost",
  "FastAPI",
  "Docker",
  "MLflow",
];

export const contact = {
  eyebrow: "Rekrut Saya",
  title: "Punya data? Mari cari",
  titleAccent: "ceritanya",
  titleTail: "bersama.",
  subtitle:
    "Terbuka untuk magang Data Scientist. Kirim pesan dan saya akan balas secepatnya.",
  banner: {
    badge: "Terbuka untuk magang",
    eyebrow: "Open Internship",
    heading: "Sedang mencari tempat magang Data Scientist. Yuk ngobrol.",
    subtitle:
      "Mencari magang sebagai Data Scientist, terbuka juga untuk Data Analyst atau Data Engineer. Domisili Surabaya.",
    details: [
      "[ISI: periode dan durasi magang yang dicari, mis. mulai bulan/tahun]",
      "[ISI: bersedia onsite/hybrid/remote]",
    ],
  },
  terminal: {
    prompt: "$ whoami",
    output: "randi, data scientist in progress",
  },
  emailCta: "Kirim Email",
  copyCta: "Salin",
  copiedCta: "Tersalin!",
  waMessage:
    "Halo Randi, saya melihat portofolio Anda dan ingin berdiskusi tentang kesempatan magang.",
  form: {
    eyebrow: "Atau kirim pesan singkat",
    nameLabel: "Nama",
    emailLabel: "Email",
    messageLabel: "Pesan",
    submit: "Buka Email",
    subject: "Peluang magang Data Scientist",
  },
  primaryCta: "Kirim Email",
  cvCta: "Unduh CV",
};

// Label heading halaman Kontak (alternatif orisinal, yang dipakai adalah yang pertama).
export const contactHeadingAlternatives = [
  "Sedang mencari tempat magang Data Scientist. Yuk ngobrol.",
  "Butuh data scientist magang? Saya siap belajar dan berkontribusi.",
  "Mari bicarakan bagaimana data bisa bantu keputusan tim Anda.",
];

export const pages = {
  home: {
    title: "Randi Nandika Danendra, Data Scientist",
    description:
      "Portofolio Randi Nandika Danendra, mahasiswa Sains Data Terapan PENS. Dari data mentah ke insight: machine learning, klasifikasi, sistem rekomendasi, dan deployment.",
  },
  projects: {
    title: "Projek — Randi Nandika Danendra",
    description:
      "Lima studi kasus proyek data science dan machine learning: FaultSense, MedDistrib, AustraliaRainPrediction, JobifyAI, dan AIRWISE.",
  },
  tools: {
    title: "Tools — Randi Nandika Danendra",
    description:
      "Keahlian teknis dan alat yang saya pakai: Python, SQL, Pandas, Scikit-learn, CatBoost, XGBoost, FastAPI, Docker, dan MLflow.",
  },
  journey: {
    title: "Journey — Randi Nandika Danendra",
    description:
      "Perjalanan belajar menjadi data scientist: pendidikan D4 Sains Data Terapan PENS dan pengalaman proyek.",
  },
  contact: {
    title: "Kontak — Randi Nandika Danendra",
    description:
      "Hubungi Randi Nandika Danendra untuk peluang magang Data Scientist. Email, WhatsApp, LinkedIn, GitHub, dan CV.",
  },
  notFound: {
    title: "Halaman tidak ditemukan — Randi Nandika Danendra",
    description: "Halaman yang Anda cari tidak ditemukan.",
  },
};

export const nav = {
  links: [
    { label: "Home", to: "/" },
    { label: "Projek", to: "/proyek" },
    { label: "Tools", to: "/tools" },
    { label: "Journey", to: "/journey" },
  ],
  cta: { label: "Kontak", to: "/kontak" },
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} Randi Nandika Danendra`,
  note: "Dibangun dengan React, Vite, dan Tailwind CSS.",
};
