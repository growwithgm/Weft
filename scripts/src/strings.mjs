// Storefront strings for every locale. scripts/build-locales.mjs writes locales/<lang>.json.
// Order of languages in s(): en, es, de, fr, it, nl, pt (pt-PT), ja.
const s = (en, es, de, fr, it, nl, pt, ja) => ({ en, es, de, fr, it, nl, pt, ja });

export default {
  // ---------- general ----------
  'general.skip_to_content': s('Skip to content', 'Saltar al contenido', 'Direkt zum Inhalt', 'Passer au contenu', 'Vai al contenuto', 'Naar de inhoud', 'Saltar para o conteúdo', 'コンテンツへスキップ'),
  'general.home': s('Home', 'Inicio', 'Startseite', 'Accueil', 'Home', 'Home', 'Início', 'ホーム'),
  'general.close': s('Close', 'Cerrar', 'Schließen', 'Fermer', 'Chiudi', 'Sluiten', 'Fechar', '閉じる'),
  'general.dismiss': s('Dismiss', 'Descartar', 'Ausblenden', 'Ignorer', 'Ignora', 'Sluiten', 'Ignorar', '閉じる'),
  'general.loading': s('Loading…', 'Cargando…', 'Wird geladen …', 'Chargement…', 'Caricamento…', 'Laden…', 'A carregar…', '読み込み中…'),
  'general.error': s('Something went wrong. Please try again.', 'Algo salió mal. Inténtalo de nuevo.', 'Etwas ist schiefgelaufen. Bitte versuche es erneut.', 'Un problème est survenu. Veuillez réessayer.', 'Si è verificato un problema. Riprova.', 'Er ging iets mis. Probeer het opnieuw.', 'Algo correu mal. Tente novamente.', '問題が発生しました。もう一度お試しください。'),
  'general.continue_shopping': s('Continue shopping', 'Seguir comprando', 'Weiter einkaufen', 'Continuer vos achats', 'Continua lo shopping', 'Verder winkelen', 'Continuar a comprar', '買い物を続ける'),
  'general.back_to_top': s('Back to top', 'Volver arriba', 'Nach oben', 'Retour en haut', 'Torna su', 'Terug naar boven', 'Voltar ao topo', 'トップへ戻る'),
  'general.previous': s('Previous', 'Anterior', 'Zurück', 'Précédent', 'Precedente', 'Vorige', 'Anterior', '前へ'),
  'general.next': s('Next', 'Siguiente', 'Weiter', 'Suivant', 'Successivo', 'Volgende', 'Seguinte', '次へ'),
  'general.pause': s('Pause', 'Pausar', 'Pausieren', 'Pause', 'Pausa', 'Pauzeren', 'Pausar', '一時停止'),
  'general.play': s('Play', 'Reproducir', 'Abspielen', 'Lecture', 'Riproduci', 'Afspelen', 'Reproduzir', '再生'),
  'general.view_all': s('View all', 'Ver todo', 'Alle ansehen', 'Tout voir', 'Vedi tutto', 'Alles bekijken', 'Ver tudo', 'すべて見る'),
  'general.read_more': s('Read more', 'Leer más', 'Weiterlesen', 'Lire la suite', 'Leggi di più', 'Lees meer', 'Ler mais', '続きを読む'),
  'general.see_more': s('See more', 'Ver más', 'Mehr anzeigen', 'Voir plus', 'Mostra di più', 'Meer zien', 'Ver mais', 'もっと見る'),
  'general.see_less': s('See less', 'Ver menos', 'Weniger anzeigen', 'Voir moins', 'Mostra meno', 'Minder zien', 'Ver menos', '閉じる'),
  'general.opens_new_window': s('Opens in a new window', 'Se abre en una ventana nueva', 'Öffnet in einem neuen Fenster', "S'ouvre dans une nouvelle fenêtre", 'Si apre in una nuova finestra', 'Opent in een nieuw venster', 'Abre numa nova janela', '新しいウィンドウで開きます'),
  'general.breadcrumbs': s('Breadcrumbs', 'Ruta de navegación', 'Brotkrümelnavigation', "Fil d'Ariane", 'Percorso di navigazione', 'Kruimelpad', 'Navegação estrutural', 'パンくずリスト'),
  'general.pagination.label': s('Pagination', 'Paginación', 'Seitennummerierung', 'Pagination', 'Impaginazione', 'Paginering', 'Paginação', 'ページ送り'),
  'general.pagination.page': s('Page {{ number }}', 'Página {{ number }}', 'Seite {{ number }}', 'Page {{ number }}', 'Pagina {{ number }}', 'Pagina {{ number }}', 'Página {{ number }}', '{{ number }}ページ'),
  'general.pagination.load_more': s('Load more', 'Cargar más', 'Mehr laden', 'Charger plus', 'Carica altri', 'Meer laden', 'Carregar mais', 'さらに読み込む'),
  'general.social.share': s('Share', 'Compartir', 'Teilen', 'Partager', 'Condividi', 'Delen', 'Partilhar', '共有'),
  'general.social.follow_on': s('Follow us on {{ network }}', 'Síguenos en {{ network }}', 'Folge uns auf {{ network }}', 'Suivez-nous sur {{ network }}', 'Seguici su {{ network }}', 'Volg ons op {{ network }}', 'Siga-nos no {{ network }}', '{{ network }}でフォロー'),
  'general.chat.label': s('Chat on WhatsApp', 'Chatear por WhatsApp', 'Auf WhatsApp chatten', 'Discuter sur WhatsApp', 'Chatta su WhatsApp', 'Chat via WhatsApp', 'Conversar no WhatsApp', 'WhatsAppでチャット'),
  'general.payment_methods': s('Payment methods', 'Métodos de pago', 'Zahlungsarten', 'Moyens de paiement', 'Metodi di pagamento', 'Betaalmethoden', 'Métodos de pagamento', 'お支払い方法'),
  'general.copyright': s('© {{ year }} {{ shop }}', '© {{ year }} {{ shop }}', '© {{ year }} {{ shop }}', '© {{ year }} {{ shop }}', '© {{ year }} {{ shop }}', '© {{ year }} {{ shop }}', '© {{ year }} {{ shop }}', '© {{ year }} {{ shop }}'),

  // ---------- accessibility ----------
  'accessibility.menu': s('Menu', 'Menú', 'Menü', 'Menu', 'Menu', 'Menu', 'Menu', 'メニュー'),
  'accessibility.open_menu': s('Open menu', 'Abrir menú', 'Menü öffnen', 'Ouvrir le menu', 'Apri il menu', 'Menu openen', 'Abrir menu', 'メニューを開く'),
  'accessibility.close_menu': s('Close menu', 'Cerrar menú', 'Menü schließen', 'Fermer le menu', 'Chiudi il menu', 'Menu sluiten', 'Fechar menu', 'メニューを閉じる'),
  'accessibility.main_navigation': s('Main', 'Principal', 'Hauptmenü', 'Principal', 'Principale', 'Hoofdmenu', 'Principal', 'メイン'),
  'accessibility.announcements': s('Announcements', 'Anuncios', 'Ankündigungen', 'Annonces', 'Annunci', 'Aankondigingen', 'Anúncios', 'お知らせ'),
  'accessibility.external_link': s('External link', 'Enlace externo', 'Externer Link', 'Lien externe', 'Link esterno', 'Externe link', 'Ligação externa', '外部リンク'),
  'accessibility.star_rating': s('{{ rating }} out of {{ max }} stars', '{{ rating }} de {{ max }} estrellas', '{{ rating }} von {{ max }} Sternen', '{{ rating }} étoiles sur {{ max }}', '{{ rating }} stelle su {{ max }}', '{{ rating }} van de {{ max }} sterren', '{{ rating }} de {{ max }} estrelas', '{{ max }}つ星中{{ rating }}'),
  'accessibility.decrease_quantity': s('Decrease quantity for {{ product }}', 'Reducir la cantidad de {{ product }}', 'Menge für {{ product }} verringern', 'Diminuer la quantité de {{ product }}', 'Riduci la quantità di {{ product }}', 'Aantal van {{ product }} verlagen', 'Diminuir a quantidade de {{ product }}', '{{ product }}の数量を減らす'),
  'accessibility.increase_quantity': s('Increase quantity for {{ product }}', 'Aumentar la cantidad de {{ product }}', 'Menge für {{ product }} erhöhen', 'Augmenter la quantité de {{ product }}', 'Aumenta la quantità di {{ product }}', 'Aantal van {{ product }} verhogen', 'Aumentar a quantidade de {{ product }}', '{{ product }}の数量を増やす'),
  'accessibility.quantity': s('Quantity', 'Cantidad', 'Menge', 'Quantité', 'Quantità', 'Aantal', 'Quantidade', '数量'),
  'accessibility.slide_of': s('Slide {{ index }} of {{ count }}', 'Diapositiva {{ index }} de {{ count }}', 'Folie {{ index }} von {{ count }}', 'Diapositive {{ index }} sur {{ count }}', 'Slide {{ index }} di {{ count }}', 'Dia {{ index }} van {{ count }}', 'Diapositivo {{ index }} de {{ count }}', '{{ count }}枚中{{ index }}枚目'),

  // ---------- header, search, account ----------
  'header.search': s('Search', 'Buscar', 'Suchen', 'Rechercher', 'Cerca', 'Zoeken', 'Pesquisar', '検索'),
  'header.account': s('Account', 'Cuenta', 'Konto', 'Compte', 'Account', 'Account', 'Conta', 'アカウント'),
  'header.sign_in': s('Log in', 'Iniciar sesión', 'Anmelden', 'Connexion', 'Accedi', 'Inloggen', 'Iniciar sessão', 'ログイン'),
  'header.cart': s('Cart', 'Carrito', 'Warenkorb', 'Panier', 'Carrello', 'Winkelwagen', 'Carrinho', 'カート'),
  'header.cart_count.one': s('Cart, {{ count }} item', 'Carrito, {{ count }} artículo', 'Warenkorb, {{ count }} Artikel', 'Panier, {{ count }} article', 'Carrello, {{ count }} articolo', 'Winkelwagen, {{ count }} artikel', 'Carrinho, {{ count }} artigo', 'カート、{{ count }}点'),
  'header.cart_count.other': s('Cart, {{ count }} items', 'Carrito, {{ count }} artículos', 'Warenkorb, {{ count }} Artikel', 'Panier, {{ count }} articles', 'Carrello, {{ count }} articoli', 'Winkelwagen, {{ count }} artikelen', 'Carrinho, {{ count }} artigos', 'カート、{{ count }}点'),
  'header.voice_search': s('Search by voice', 'Buscar por voz', 'Sprachsuche', 'Recherche vocale', 'Cerca con la voce', 'Zoeken met spraak', 'Pesquisar por voz', '音声で検索'),
  'header.search_placeholder': s('Search products', 'Buscar productos', 'Produkte suchen', 'Rechercher des produits', 'Cerca prodotti', 'Producten zoeken', 'Pesquisar produtos', '商品を検索'),
  'header.submenu': s('{{ title }} submenu', 'Submenú de {{ title }}', 'Untermenü {{ title }}', 'Sous-menu {{ title }}', 'Sottomenu {{ title }}', 'Submenu {{ title }}', 'Submenu {{ title }}', '{{ title }}のサブメニュー'),
  'header.back': s('Back', 'Atrás', 'Zurück', 'Retour', 'Indietro', 'Terug', 'Voltar', '戻る'),

  // ---------- wholesale (header and account) ----------
  'wholesale.ordering_for': s('Ordering for', 'Pedido para', 'Bestellung für', 'Commande pour', 'Ordine per', 'Bestellen voor', 'Encomenda para', '注文先'),
  'wholesale.ordering_for_location': s('Ordering for {{ company }} · {{ location }}', 'Pedido para {{ company }} · {{ location }}', 'Bestellung für {{ company }} · {{ location }}', 'Commande pour {{ company }} · {{ location }}', 'Ordine per {{ company }} · {{ location }}', 'Bestellen voor {{ company }} · {{ location }}', 'Encomenda para {{ company }} · {{ location }}', '{{ company }}・{{ location }}の注文'),
  'wholesale.store_credit': s('Store credit', 'Saldo a favor', 'Guthaben', 'Crédit boutique', 'Credito negozio', 'Tegoed', 'Crédito na loja', 'ストアクレジット'),
  'wholesale.account_and_orders': s('Account and orders', 'Cuenta y pedidos', 'Konto und Bestellungen', 'Compte et commandes', 'Account e ordini', 'Account en bestellingen', 'Conta e encomendas', 'アカウントと注文'),
  'wholesale.sign_out': s('Sign out', 'Cerrar sesión', 'Abmelden', 'Déconnexion', 'Esci', 'Uitloggen', 'Terminar sessão', 'ログアウト'),
  'wholesale.change': s('Change', 'Cambiar', 'Ändern', 'Modifier', 'Cambia', 'Wijzigen', 'Alterar', '変更'),
  'wholesale.location_updated': s('Prices and availability updated for {{ location }}.', 'Precios y disponibilidad actualizados para {{ location }}.', 'Preise und Verfügbarkeit für {{ location }} aktualisiert.', 'Prix et disponibilité mis à jour pour {{ location }}.', 'Prezzi e disponibilità aggiornati per {{ location }}.', 'Prijzen en beschikbaarheid bijgewerkt voor {{ location }}.', 'Preços e disponibilidade atualizados para {{ location }}.', '{{ location }}の価格と在庫状況を更新しました。'),
  'wholesale.switch_location': s('Switch to {{ location }}', 'Cambiar a {{ location }}', 'Zu {{ location }} wechseln', 'Passer à {{ location }}', 'Passa a {{ location }}', 'Overschakelen naar {{ location }}', 'Mudar para {{ location }}', '{{ location }}に切り替え'),
  'wholesale.current_location': s('Current location', 'Ubicación actual', 'Aktueller Standort', 'Emplacement actuel', 'Sede attuale', 'Huidige locatie', 'Localização atual', '現在の拠点'),
  'wholesale.not_found_line': s('Wholesale customer? Sign in to see trade-only products.', '¿Eres cliente mayorista? Inicia sesión para ver los productos exclusivos.', 'Großhandelskunde? Melde dich an, um Händlerprodukte zu sehen.', 'Client professionnel ? Connectez-vous pour voir les produits réservés.', 'Cliente all’ingrosso? Accedi per vedere i prodotti riservati.', 'Groothandelsklant? Log in om producten voor handelaren te zien.', 'Cliente grossista? Inicie sessão para ver os produtos exclusivos.', '卸売のお客様はログインすると業者向け商品をご覧いただけます。'),
  'wholesale.sample_notice': s('Wholesale preview — sample data', 'Vista previa mayorista: datos de ejemplo', 'Großhandelsvorschau – Beispieldaten', 'Aperçu professionnel — données d’exemple', 'Anteprima ingrosso — dati di esempio', 'Groothandelvoorbeeld — voorbeeldgegevens', 'Pré-visualização grossista — dados de exemplo', '卸売プレビュー（サンプルデータ）'),

  // ---------- localization ----------
  'localization.country': s('Country/region', 'País/región', 'Land/Region', 'Pays/région', 'Paese/regione', 'Land/regio', 'País/região', '国/地域'),
  'localization.language': s('Language', 'Idioma', 'Sprache', 'Langue', 'Lingua', 'Taal', 'Idioma', '言語'),
  'localization.update': s('Update', 'Actualizar', 'Aktualisieren', 'Mettre à jour', 'Aggiorna', 'Bijwerken', 'Atualizar', '更新'),
  'localization.search_country': s('Search countries', 'Buscar países', 'Länder suchen', 'Rechercher un pays', 'Cerca paesi', 'Landen zoeken', 'Pesquisar países', '国を検索'),
  'localization.no_results': s('No countries match your search.', 'Ningún país coincide con tu búsqueda.', 'Keine Länder gefunden.', 'Aucun pays ne correspond à votre recherche.', 'Nessun paese corrisponde alla ricerca.', 'Geen landen gevonden.', 'Nenhum país corresponde à pesquisa.', '該当する国がありません。'),

  // ---------- newsletter ----------
  'newsletter.label': s('Email', 'Correo electrónico', 'E-Mail', 'E-mail', 'Email', 'E-mail', 'E-mail', 'メールアドレス'),
  'newsletter.placeholder': s('Your email', 'Tu correo electrónico', 'Deine E-Mail-Adresse', 'Votre e-mail', 'La tua email', 'Je e-mailadres', 'O seu e-mail', 'メールアドレス'),
  'newsletter.subscribe': s('Subscribe', 'Suscribirme', 'Abonnieren', "S'abonner", 'Iscriviti', 'Aanmelden', 'Subscrever', '登録する'),
  'newsletter.success': s('Thanks for subscribing.', 'Gracias por suscribirte.', 'Danke für dein Abonnement.', 'Merci pour votre inscription.', 'Grazie per l’iscrizione.', 'Bedankt voor je aanmelding.', 'Obrigado por subscrever.', 'ご登録ありがとうございます。'),

  // ---------- price ----------
  'price.regular': s('Regular price', 'Precio habitual', 'Normaler Preis', 'Prix habituel', 'Prezzo di listino', 'Normale prijs', 'Preço normal', '通常価格'),
  'price.sale': s('Sale price', 'Precio de oferta', 'Angebotspreis', 'Prix soldé', 'Prezzo scontato', 'Actieprijs', 'Preço de saldo', 'セール価格'),
  'price.from': s('From {{ price }}', 'Desde {{ price }}', 'Ab {{ price }}', 'À partir de {{ price }}', 'Da {{ price }}', 'Vanaf {{ price }}', 'Desde {{ price }}', '{{ price }}から'),
  'price.unit_price': s('Unit price', 'Precio unitario', 'Grundpreis', 'Prix unitaire', 'Prezzo unitario', 'Eenheidsprijs', 'Preço unitário', '単価'),
  'price.per': s('per', 'por', 'pro', 'par', 'per', 'per', 'por', 'あたり'),
  'price.per_piece': s('per piece', 'por unidad', 'pro Stück', 'par pièce', 'al pezzo', 'per stuk', 'por unidade', '1点あたり'),
  'price.wholesale': s('Wholesale price', 'Precio mayorista', 'Großhandelspreis', 'Prix de gros', 'Prezzo all’ingrosso', 'Groothandelsprijs', 'Preço grossista', '卸売価格'),
  'price.tax_included': s('Tax included.', 'Impuestos incluidos.', 'Inkl. MwSt.', 'Taxes incluses.', 'Imposte incluse.', 'Inclusief btw.', 'Impostos incluídos.', '税込。'),
  'price.tax_excluded': s('Tax excluded.', 'Impuestos no incluidos.', 'Zzgl. MwSt.', 'Hors taxes.', 'Imposte escluse.', 'Exclusief btw.', 'Impostos não incluídos.', '税抜。'),
  'price.shipping_at_checkout': s('Shipping calculated at checkout.', 'Gastos de envío calculados al finalizar la compra.', 'Versand wird an der Kasse berechnet.', 'Frais d’expédition calculés au paiement.', 'Spedizione calcolata al checkout.', 'Verzending wordt berekend bij het afrekenen.', 'Portes calculados no checkout.', '送料はチェックアウト時に計算されます。'),

  // ---------- 404 ----------
  'not_found.title': s('Page not found', 'Página no encontrada', 'Seite nicht gefunden', 'Page introuvable', 'Pagina non trovata', 'Pagina niet gevonden', 'Página não encontrada', 'ページが見つかりません'),
  'not_found.text': s('The page you were looking for has moved or no longer exists.', 'La página que buscabas se ha movido o ya no existe.', 'Die gesuchte Seite wurde verschoben oder existiert nicht mehr.', "La page que vous cherchez a été déplacée ou n'existe plus.", 'La pagina che cercavi è stata spostata o non esiste più.', 'De pagina die je zoekt is verplaatst of bestaat niet meer.', 'A página que procurava foi movida ou já não existe.', 'お探しのページは移動したか、存在しません。'),

  // ---------- password ----------
  'password.enter_with_password': s('Enter using password', 'Entrar con contraseña', 'Mit Passwort betreten', 'Entrer avec le mot de passe', 'Entra con la password', 'Toegang met wachtwoord', 'Entrar com palavra-passe', 'パスワードで入る'),
  'password.password': s('Password', 'Contraseña', 'Passwort', 'Mot de passe', 'Password', 'Wachtwoord', 'Palavra-passe', 'パスワード'),
  'password.enter': s('Enter', 'Entrar', 'Betreten', 'Entrer', 'Entra', 'Openen', 'Entrar', '入る'),
  'password.wrong': s('Wrong password.', 'Contraseña incorrecta.', 'Falsches Passwort.', 'Mot de passe incorrect.', 'Password errata.', 'Onjuist wachtwoord.', 'Palavra-passe incorreta.', 'パスワードが違います。'),
  'password.owner': s('Are you the store owner?', '¿Eres el propietario de la tienda?', 'Bist du der Shop-Inhaber?', 'Vous êtes le propriétaire de la boutique ?', 'Sei il proprietario del negozio?', 'Ben je de eigenaar van de winkel?', 'É o proprietário da loja?', 'ストアのオーナーですか？'),
  'password.owner_link': s('Log in here', 'Inicia sesión aquí', 'Hier anmelden', 'Connectez-vous ici', 'Accedi qui', 'Log hier in', 'Inicie sessão aqui', 'こちらからログイン'),
  'password.powered_by': s('This shop will be powered by', 'Esta tienda funcionará con', 'Dieser Shop wird betrieben von', 'Cette boutique sera propulsée par', 'Questo negozio sarà gestito da', 'Deze winkel wordt aangedreven door', 'Esta loja terá tecnologia', 'このストアは次のサービスで運営されます：'),

  // ---------- gift card ----------
  'gift_card.title': s('Your gift card', 'Tu tarjeta de regalo', 'Deine Geschenkkarte', 'Votre carte-cadeau', 'La tua carta regalo', 'Je cadeaubon', 'O seu cartão de oferta', 'ギフトカード'),
  'gift_card.value': s('Your {{ value }} gift card for {{ shop }}', 'Tu tarjeta de regalo de {{ value }} para {{ shop }}', 'Deine Geschenkkarte über {{ value }} für {{ shop }}', 'Votre carte-cadeau de {{ value }} pour {{ shop }}', 'La tua carta regalo da {{ value }} per {{ shop }}', 'Je cadeaubon van {{ value }} voor {{ shop }}', 'O seu cartão de oferta de {{ value }} para {{ shop }}', '{{ shop }}の{{ value }}ギフトカード'),
  'gift_card.balance': s('Balance: {{ balance }}', 'Saldo: {{ balance }}', 'Guthaben: {{ balance }}', 'Solde : {{ balance }}', 'Saldo: {{ balance }}', 'Saldo: {{ balance }}', 'Saldo: {{ balance }}', '残高：{{ balance }}'),
  'gift_card.code': s('Gift card code', 'Código de la tarjeta de regalo', 'Geschenkkartencode', 'Code de la carte-cadeau', 'Codice della carta regalo', 'Cadeauboncode', 'Código do cartão de oferta', 'ギフトカードコード'),
  'gift_card.copy': s('Copy code', 'Copiar código', 'Code kopieren', 'Copier le code', 'Copia codice', 'Code kopiëren', 'Copiar código', 'コードをコピー'),
  'gift_card.copied': s('Code copied', 'Código copiado', 'Code kopiert', 'Code copié', 'Codice copiato', 'Code gekopieerd', 'Código copiado', 'コピーしました'),
  'gift_card.expired': s('This gift card expired on {{ date }}.', 'Esta tarjeta de regalo caducó el {{ date }}.', 'Diese Geschenkkarte ist am {{ date }} abgelaufen.', 'Cette carte-cadeau a expiré le {{ date }}.', 'Questa carta regalo è scaduta il {{ date }}.', 'Deze cadeaubon is verlopen op {{ date }}.', 'Este cartão de oferta expirou a {{ date }}.', 'このギフトカードは{{ date }}に有効期限が切れました。'),
  'gift_card.expires': s('Expires on {{ date }}', 'Caduca el {{ date }}', 'Gültig bis {{ date }}', 'Expire le {{ date }}', 'Scade il {{ date }}', 'Verloopt op {{ date }}', 'Expira a {{ date }}', '有効期限：{{ date }}'),
  'gift_card.disabled': s('This gift card is disabled.', 'Esta tarjeta de regalo está desactivada.', 'Diese Geschenkkarte ist deaktiviert.', 'Cette carte-cadeau est désactivée.', 'Questa carta regalo è disattivata.', 'Deze cadeaubon is uitgeschakeld.', 'Este cartão de oferta está desativado.', 'このギフトカードは無効です。'),
  'gift_card.use_at_checkout': s('Use this code at checkout to redeem your gift card.', 'Usa este código al finalizar la compra para canjear tu tarjeta de regalo.', 'Löse den Code an der Kasse ein.', 'Utilisez ce code au paiement pour utiliser votre carte-cadeau.', 'Usa questo codice al checkout per riscattare la carta regalo.', 'Gebruik deze code bij het afrekenen.', 'Utilize este código no checkout para usar o cartão de oferta.', 'チェックアウト時にこのコードを入力してください。'),
  'gift_card.shop_now': s('Shop now', 'Comprar ahora', 'Jetzt einkaufen', 'Acheter maintenant', 'Acquista ora', 'Nu winkelen', 'Comprar agora', '今すぐ購入'),
  'gift_card.print': s('Print this gift card', 'Imprimir esta tarjeta de regalo', 'Geschenkkarte drucken', 'Imprimer cette carte-cadeau', 'Stampa questa carta regalo', 'Deze cadeaubon afdrukken', 'Imprimir este cartão de oferta', 'ギフトカードを印刷'),
  'gift_card.apple_wallet': s('Add to Apple Wallet', 'Añadir a Apple Wallet', 'Zu Apple Wallet hinzufügen', 'Ajouter à Apple Wallet', 'Aggiungi a Apple Wallet', 'Toevoegen aan Apple Wallet', 'Adicionar à Apple Wallet', 'Apple Walletに追加'),
  'gift_card.qr_code': s('QR code for the gift card', 'Código QR de la tarjeta de regalo', 'QR-Code der Geschenkkarte', 'Code QR de la carte-cadeau', 'Codice QR della carta regalo', 'QR-code van de cadeaubon', 'Código QR do cartão de oferta', 'ギフトカードのQRコード')
};
