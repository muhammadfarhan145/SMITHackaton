const supabaseClient = supabase.createClient("https://queftwxqyuinynpsixqa.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWZ0d3hxeXVpbnlucHNpeHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTQ5NDEsImV4cCI6MjA3NTQ5MDk0MX0.TWex1aIXHoopzD9q1LR2hOt6hsBY6JN3aAtaXpvM5hc"
);

// Modals
const fieldErrorModal = () => {
  const fieldsErrorModal = new bootstrap.Modal(
    document.getElementById("fielderrorModal")
  );
  fieldsErrorModal.show();
};

const passLenghtModal = () => {
  const passwordErrorModal = new bootstrap.Modal(
    document.getElementById("passworderrorModal")
  );
  passwordErrorModal.show();
};

const checkUser = async () => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (session) {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data?.user) {
      return;
    }
    window.location.href = "../../index.html";
  }
};

checkUser();

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const signInbutton = document.getElementById("login_btn");
    const Error_P = document.getElementById("Error_P");
    const email = document.getElementById("loginEmailInput").value.trim();
    const password = document.getElementById("loginPasswordInput").value.trim();

    Error_P.textContent = "";

    if(!email || !password){
        fieldErrorModal();
        Error_P.textContent = "Fill all fields";
        return;
    }

    if (password.length < 6) {
      passLenghtModal();
      Error_P.textContent = "Password Must be 6+ Characters"
      return;
    }

    signInbutton.disabled = true
    signInbutton.innerHTML = `
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Logging In...</span>
    `;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        signInbutton.disabled = false;
        signInbutton.innerHTML = `
        <i class="fas fa-sign-in-alt"></i> Login Securely
        `;
        Error_P.textContent = error.message;
        console.error(error.message);
        return;
    }

    signInbutton.innerHTML = `
      <i class="fas fa-check text-success"></i> Success!
    `;
    setTimeout(() => {
      window.location.href = "../../BookAppointments/bookAppointments.html";
    }, 800);
})