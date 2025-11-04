const supabaseClient = supabase.createClient(
  "https://queftwxqyuinynpsixqa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWZ0d3hxeXVpbnlucHNpeHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTQ5NDEsImV4cCI6MjA3NTQ5MDk0MX0.TWex1aIXHoopzD9q1LR2hOt6hsBY6JN3aAtaXpvM5hc"
);

// Modal
const signInFirstModal = () => {
  const signInFirstModal = new bootstrap.Modal(
    document.getElementById("signInFirstModal")
  );
  signInFirstModal.show();
};


  async function navbarSignOut() {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
      document.querySelector(".loginNav").textContent = "SignOut";
      document.querySelector(".loginNav").onclick = async () => {
        await supabaseClient.auth.signOut();
        alert("Sign Out Successfully!");
        location.reload();
      };
    }
  }
  navbarSignOut();

async function loadMyAppointments() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    signInFirstModal();
    setTimeout(() => window.location.href = "../Auth/Login/login.html", 300);
    return;
  }

  const { data } = await supabaseClient
    .from('appointments')
    .select('*')
    .eq('user_id', user.id);

  const box = document.querySelector('.appointments_container');
  box.innerHTML = '';

  if (!data || data.length === 0) {
    box.innerHTML = '<p class="text-center p-5">No appointments yet!</p>';
    return;
  }

  data.forEach(a => {
    const date = new Date(a.appointment_date).toLocaleDateString('en-GB');
    box.innerHTML += `
      <div class="apmt_item" data-id="${a.id}">
        <div class="apmt_date">
          <strong>${date}</strong><br>
          <small>${a.time_slot}</small>
        </div>
        <div class="apmt_doctor">
          <strong>${a.doctor_name}</strong><br>
          <span>Patient: ${a.patient_name}</span>
        </div>
        <div class="apmt_status">
          <span class="status">${a.status}</span>
        </div>
        <button type="button" 
                class="action_btn view_btn" 
                data-id="${a.id}"
                data-bs-toggle="modal" 
                data-bs-target="#viewModal">
          View
        </button>
      </div>
    `;
  });

  document.querySelectorAll('.view_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const apmtId = btn.dataset.id;
      const apmt = data.find(a => a.id == apmtId);

      const modal = document.getElementById("modal-body");
      modal.innerHTML = `
        <div class="row g-3">
          <div class="col-6">
            <strong>Date:</strong><br>
            <span class="fs-5 text-dark">${new Date(apmt.appointment_date).toLocaleDateString('en-GB')}</span>
          </div>
          <div class="col-6">
            <strong>Time:</strong><br>
            <span class="fs-5 text-dark">${apmt.time_slot}</span>
          </div>
          <div class="col-12">
            <strong>Doctor:</strong><br>
            <span class="fs-5 text-primary">${apmt.doctor_name}</span>
          </div>
          <div class="col-12">
            <strong>Status:</strong><br>
            <span class="badge fs-6 ${apmt.status === 'Confirmed' ? 'bg-success' : 'bg-warning'}">
              ${apmt.status}
            </span>
          </div>
          <div class="col-12">
            <strong>Token No:</strong><br>
            <span id="modal-token" class="fs-4 text-danger fw-bold">${apmt.token_no}</span>          </div>
          <div class="col-12">
            <strong>Instructions:</strong>
            <ul class="mt-2">
              <li>Report to Reception <strong>15 mins early</strong></li>
              <li>Bring previous reports & ID proof</li>
              <li>Room: <span id="modal-room">305 (3rd Floor)</span></li>
            </ul>
          </div>
        </div>
      `;
    });
  });
}

loadMyAppointments();