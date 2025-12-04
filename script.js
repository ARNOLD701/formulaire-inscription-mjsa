document.addEventListener('DOMContentLoaded', function() {
            // Initialisation - masquer le document au chargement
            const documentContainer = document.getElementById('documentContainer');
            documentContainer.style.display = 'none';
            
            // Gestion de la prévisualisation de la photo
            const childPhotoInput = document.getElementById('childPhoto');
            const childPhotoPreview = document.getElementById('childPhotoPreview');
            
            childPhotoInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        childPhotoPreview.innerHTML = `<img src="${e.target.result}" alt="Photo de l'enfant">`;
                    }
                    reader.readAsDataURL(file);
                } else {
                    childPhotoPreview.innerHTML = '<span>Aucune photo sélectionnée</span>';
                }
            });
            
            // Génération du document
            const generateBtn = document.getElementById('generateBtn');
            const successMessage = document.getElementById('successMessage');
            
            generateBtn.addEventListener('click', function() {
                // Récupération des valeurs du formulaire
                const childFirstName = document.getElementById('childFirstName').value;
                const childLastName = document.getElementById('childLastName').value;
                const childBirthDate = document.getElementById('childBirthDate').value;
                const childBirthPlace = document.getElementById('childBirthPlace').value;
                const childAddress = document.getElementById('childAddress').value;
                const childCategorie = document.getElementById('childCategorie').value;
                const childYear = document.getElementById('childYear').value;

                
                const motherFirstName = document.getElementById('motherFirstName').value;
                const motherLastName = document.getElementById('motherLastName').value;
                const motherBirthDate = document.getElementById('motherBirthDate').value;
                const motherBirthPlace = document.getElementById('motherBirthPlace').value;
                const motherAddress = document.getElementById('motherAddress').value;
                const motherNumber = document.getElementById('motherNumber').value;
                
                const fatherFirstName = document.getElementById('fatherFirstName').value;
                const fatherLastName = document.getElementById('fatherLastName').value;
                const fatherBirthDate = document.getElementById('fatherBirthDate').value;
                const fatherBirthPlace = document.getElementById('fatherBirthPlace').value;
                const fatherAddress = document.getElementById('fatherAddress').value;
                const fatherNumber = document.getElementById('fatherNumber').value;
                
                // Validation basique
                if (!childFirstName || !childLastName || !motherFirstName || !motherLastName || !fatherFirstName || !fatherLastName) {
                    alert('Veuillez remplir au moins les noms et prénoms de l\'enfant, de la mère et du père.');
                    return;
                }
                
                // Mise à jour du document
                document.getElementById('docChildName').textContent = `${childFirstName} ${childLastName}`;
                document.getElementById('docChildBirthDate').textContent = formatDate(childBirthDate);
                document.getElementById('docChildBirthPlace').textContent = childBirthPlace;
                document.getElementById('docChildAddress').textContent = childAddress;
                document.getElementById('docChildCategorie').textContent = childCategorie;
                document.getElementById('docChildYear').textContent = formatNumber(childYear);

                
                document.getElementById('docMotherName').textContent = `${motherFirstName} ${motherLastName}`;
                document.getElementById('docMotherBirthDate').textContent = formatDate(motherBirthDate);
                document.getElementById('docMotherBirthPlace').textContent = motherBirthPlace;
                document.getElementById('docMotherAddress').textContent = motherAddress;
                document.getElementById('docMotherNumber').textContent = FormatPhoneNumber(motherNumber);
                
                document.getElementById('docFatherName').textContent = `${fatherFirstName} ${fatherLastName}`;
                document.getElementById('docFatherBirthDate').textContent = formatDate(fatherBirthDate);
                document.getElementById('docFatherBirthPlace').textContent = fatherBirthPlace;
                document.getElementById('docFatherAddress').textContent = fatherAddress;
                document.getElementById('docFatherNumber').textContent = FormatPhoneNumber(fatherNumber);
                
                // Date de génération du document
                document.getElementById('documentDate').textContent = new Date().toLocaleDateString('fr-FR');
                
                // Gestion de la photo
                const docChildPhoto = document.getElementById('docChildPhoto');
                if (childPhotoInput.files && childPhotoInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        docChildPhoto.innerHTML = `<img src="${e.target.result}" alt="Photo de l'enfant">`;
                    }
                    reader.readAsDataURL(childPhotoInput.files[0]);
                } else {
                    docChildPhoto.innerHTML = '<span>Aucune photo disponible</span>';
                }
                
                // Affichage du document avec animation
                documentContainer.style.display = 'block';
                documentContainer.classList.add('fade-in');
                
                // Afficher le message de succès
                successMessage.style.display = 'block';
                
                // Défilement vers le document
                documentContainer.scrollIntoView({ behavior: 'smooth' });
            });
            
            //Fonction pour numéro de téléphone
            function FormatPhoneNumber(phone){
                if(!phone) return 'Non renseigné';
                
                //Supprimer les caractères non numériques
                const cleaned = phone.toString().replace(/\D/g, '');

                //Formater selon la longueur
                if(cleaned.length === 10) {
                    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
                }

                return phone;
            }
            //Fonction pour les nombres
            function formatNumber(number){
                if(!number && number !== 0) return 'Non renseigné';
                return new Intl.NumberFormat('fr-FR').format(number);
            }

            // Fonction pour formater la date
            function formatDate(dateString) {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toLocaleDateString('fr-FR');
            }
            
            // Gestion du téléchargement PDF
            const downloadPdfBtn = document.getElementById('downloadPdfBtn');
            const loadingIndicator = document.getElementById('loadingIndicator');
            
            downloadPdfBtn.addEventListener('click', function() {
                // Afficher l'indicateur de chargement
                loadingIndicator.style.display = 'block';
                
                // Utiliser html2canvas pour capturer le document
                html2canvas(document.getElementById('documentContainer'), {
                    scale: 5, // Augmenter la qualité
                    useCORS: true,
                    logging: false,
                    //Ignorer les éléments la classe no-print
                    ignoreElements: function(element){
                        return element.classList.contains('no-print');
                    }
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/jpeg', 2.0);
                    
                    // Créer le PDF
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    
                    const imgWidth = 210; // Largeur A4
                    const pageHeight = 295; // Hauteur A4
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 0;
                    
                    // Ajouter la première page
                    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                    
                    // Ajouter des pages supplémentaires si nécessaire
                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
                    
                    // Télécharger le PDF
                    const fileName = `Fiche_didentification_${new Date().toISOString().slice(0, 10)}.pdf`;
                    pdf.save(fileName);
                    
                    // Masquer l'indicateur de chargement
                    loadingIndicator.style.display = 'none';
                }).catch(error => {
                    console.error('Erreur lors de la génération du PDF:', error);
                    alert('Une erreur est survenue lors de la génération du PDF.');
                    loadingIndicator.style.display = 'none';
                });
            });
            
            // Gestion du bouton modifier
            const editBtn = document.getElementById('editBtn');
            editBtn.addEventListener('click', function() {
                // Masquer le document et le message de succès
                documentContainer.style.display = 'none';
                successMessage.style.display = 'none';
                
                // Défilement vers le formulaire
                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
            });
        });