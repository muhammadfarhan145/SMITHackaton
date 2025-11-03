const supabaseClient = supabase.createClient("https://queftwxqyuinynpsixqa.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWZ0d3hxeXVpbnlucHNpeHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTQ5NDEsImV4cCI6MjA3NTQ5MDk0MX0.TWex1aIXHoopzD9q1LR2hOt6hsBY6JN3aAtaXpvM5hc"
);

const docSelect = document.getElementById("doctorSelect");
const slotSelect = document.getElementById("slotSelect");
const bookAppointmentBtn = document.getElementById("bookAppointmentBtn");

document.querySelector('input[type="date"]').min = new Date().toISOString().split("T")[0];

const loadDoctors = async () => {
    slotSelect.disabled = true
    const { data, error } = await supabaseClient
    .from("doctors")
    .select("id, name, specialty, slots")

    if(error) {
        console.error(error.message)
        return;
    }

    data.forEach(doc => {
        const dOption = new Option(`${doc.name} - ${doc.specialty}`, doc.id);
        dOption.dataset.doctorName = doc.name;
        dOption.dataset.slots = JSON.stringify(doc.slots);
        docSelect.appendChild(dOption);
    });
};

docSelect.onchange = () => {
    const selected = docSelect.selectedOptions[0];
    slotSelect.innerHTML = `<option>Choose Slot</option>`
    slotSelect.disabled = true;

    if(!selected.value || !selected.dataset.slots){
        return;
    }

    slotSelect.disabled = false

    const slots = JSON.parse(selected.dataset.slots);
    slots.forEach(s => {
        const timeText = `${s.start} - ${s.end}`;
        const sOption = new Option(timeText, timeText);
        slotSelect.appendChild(sOption);
    });
};

bookAppointmentBtn.onclick = async (event) => {
    event.preventDefault();
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if(!user) {
        alert("Signin First");
        setTimeout(() => {
            window.location.href = "../Auth/Login/login.html";
        }, 300);
    }

    const appointmentDate = document.getElementById("appointmentDate").value;
    const patientName = document.getElementById("patientName").value.trim();
    const patientAge = document.getElementById("patientAge").value.trim();
    const patientEmail = document.getElementById("patientEmail").value.trim();
    const patientPhone = document.getElementById("patientPhone").value.trim();
    const reason = document.getElementById("reason").value.trim();
    const timeSlot = slotSelect.value;
    const doctorName = docSelect.selectedOptions[0].dataset.doctorName;

    if(!appointmentDate || !patientName || !patientAge || !patientEmail || !patientPhone || !reason || !timeSlot || !doctorName) {
        alert("Fill all Fields");
        return;
    }

    const { error } = await supabaseClient
    .from("appointments")
    .insert({
        user_id: user.id,
        doctor_name: doctorName,
        appointment_date: appointmentDate,
        time_slot: timeSlot,
        patient_name: patientName,
        patient_age: patientAge,
        patient_email: patientEmail,
        patient_phone: patientPhone,
        reason: reason,
    });

    if( error ) {
        alert("error")
        console.error(error.message);
        return;
    }

    alert("Appointment Booked!");
    setTimeout(() => {
       window.location.href = "../MyAppointments/MyAppointments.html";
    }, 800);
}

loadDoctors();