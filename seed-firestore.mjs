/**
 * SEED FIRESTORE - Tahm King
 * ───────────────────────────────────────────────────────────────
 * Sube todos los datos de data.json a Firestore.
 *
 * USO:
 *   1. npm install firebase-admin
 *   2. Descarga tu serviceAccountKey.json desde Firebase Console:
 *      Firebase → Configuración del proyecto → Cuentas de servicio → Generar clave
 *   3. node seed-firestore.mjs
 * ───────────────────────────────────────────────────────────────
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── 1. Inicializar Firebase Admin ─────────────────────────────
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8')
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ── 2. Leer data.json ─────────────────────────────────────────
const data = JSON.parse(
  readFileSync(join(__dirname, 'src/assets/data/data.json'), 'utf8')
);

// ── 3. Función genérica para subir colecciones ───────────────
async function seedCollection(collectionName, items, idField = 'id') {
  console.log(`\n📦 Subiendo "${collectionName}" (${items.length} docs)...`);
  const batch = db.batch();
  for (const item of items) {
    const docId = String(item[idField]);
    const ref = db.collection(collectionName).doc(docId);
    batch.set(ref, item);
  }
  await batch.commit();
  console.log(`   ✅ "${collectionName}" listo.`);
}

// ── 4. Subir documento único (site, contacto) ─────────────────
async function seedSingleDoc(collectionName, docId, data) {
  console.log(`\n📄 Subiendo "${collectionName}/${docId}"...`);
  await db.collection(collectionName).doc(docId).set(data);
  console.log(`   ✅ Listo.`);
}

// ── 5. Ejecutar seed ──────────────────────────────────────────
async function main() {
  console.log('🚀 Iniciando seed de Firestore para Tahm King...\n');

  await seedCollection('categorias',    data.categorias);
  await seedCollection('productos',     data.productos);
  await seedCollection('ofertas',       data.ofertas);
  await seedCollection('alergenos',     data.alergenos, 'id');
  await seedCollection('tipos_pedido',  data.tipos_pedido, 'id');
  await seedCollection('ubicaciones',   data.ubicaciones, 'id');
  await seedCollection('pedidos',       data.pedidos);

  // Usuarios: usamos email como ID para facilitar búsquedas
  console.log(`\n📦 Subiendo "usuarios" (${data.usuarios.length} docs)...`);
  const batchU = db.batch();
  for (const u of data.usuarios) {
    const ref = db.collection('usuarios').doc(String(u.id));
    batchU.set(ref, u);
  }
  await batchU.commit();
  console.log('   ✅ "usuarios" listo.');

  // Documento único: site
  await seedSingleDoc('config', 'site', data.site);

  // Documento único: contacto
  await seedSingleDoc('config', 'contacto', data.contacto);

  console.log('\n🎉 ¡Seed completado con éxito!\n');
}

main().catch(err => {
  console.error('❌ Error durante el seed:', err);
  process.exit(1);
});
