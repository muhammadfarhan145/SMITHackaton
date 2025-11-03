const supabaseClient = supabase.createClient(
  "https://queftwxqyuinynpsixqa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWZ0d3hxeXVpbnlucHNpeHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTQ5NDEsImV4cCI6MjA3NTQ5MDk0MX0.TWex1aIXHoopzD9q1LR2hOt6hsBY6JN3aAtaXpvM5hc"
);

async function loadMyAppointments() {
  const { data: { user } } = await supabaseClient.auth.getUser();
    if(!user) {
        alert("Signin First");
        setTimeout(() => {
            window.location.href = "../Auth/Login/login.html";
        }, 300);
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
      <div class="apmt_item">
        <div class="apmt_date">
          <strong>${date}</strong><br>
          <small>${a.time_slot}</small>
        </div>
        <div class="apmt_doctor">
          <strong>${a.doctor_name}</strong><br>
          <span>Patient: ${a.patient_name}</span>
        </div>
      </div>`;
  });
}

loadMyAppointments();