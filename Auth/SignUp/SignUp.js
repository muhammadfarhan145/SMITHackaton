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

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const signUpButton = document.getElementById("signUpButton");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!name || !password || !email){
        fieldErrorModal();
        return;
    }

    if(password.length < 6){
        passLenghtModal();
        return;
    }

    signUpButton.disabled = true
    signUpButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Signing In...</span>
    `;

    const { error }  = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
    });

    if(error) {
        signUpButton.disabled = false;
        signUpButton.innerHTML = `
        <i class="fas fa-user-plus"></i> Sign Up Free
        `;
        console.error(error.message);
        return;
    }

    const { error: dberror } = await supabaseClient
    .from("hackathonUsers")
    .insert({ 
        full_name: name,
        email: email
    });

    if(dberror) {
        signUpButton.disabled = false;
        signUpButton.innerHTML = `
        <i class="fas fa-user-plus"></i> Sign Up Free
        `;
        console.error(dberror.message);
        return;
    }

    window.location.href = "../Login/login.html";
})