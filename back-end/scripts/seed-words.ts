import { PrismaClient } from '@prisma/client';
import * as https from 'https';
import { parser } from 'stream-json';
import { streamObject } from 'stream-json/streamers/StreamObject';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const URL = 'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json';

async function main() {
    console.log('Iniciando o download e importação de palavras...');

    try {
        const count = await prisma.dictionaryWord.count();
        if (count > 0) {
            console.log('📦 Banco de dados já possui palavras. Pulando etapa de seed...');
            return;
        }
    } catch (e) {
        console.error('Erro ao checar contagem de palavras:', e);
    }

    let totalProcessado = 0;
    let chunk: any[] = [];
    const CHUNK_SIZE = 5000;

    return new Promise((resolve, reject) => {
        https.get(URL, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Falha no download. Status: ${res.statusCode}`));
            }

            const pipeline = res.pipe(parser()).pipe(streamObject());

            pipeline.on('data', async ({ key }) => {
                pipeline.pause();

                chunk.push({
                    word: key
                });

                if (chunk.length >= CHUNK_SIZE) {
                    try {
                        await prisma.dictionaryWord.createMany({
                            data: chunk,
                            skipDuplicates: true,
                        });
                        totalProcessado += chunk.length;
                        console.log(`${totalProcessado} palavras importadas...`);
                        chunk = [];
                    } catch (error) {
                        console.error('Erro ao inserir lote no banco:', error);
                    }
                }

                pipeline.resume();
            });

            pipeline.on('end', async () => {
                if (chunk.length > 0) {
                    try {
                        await prisma.dictionaryWord.createMany({
                            data: chunk,
                            skipDuplicates: true,
                        });
                        totalProcessado += chunk.length;
                    } catch (error) {
                        console.error('Erro ao inserir o último lote no banco:', error);
                    }
                }
                console.log(`\n✅ Importação concluída com sucesso! Total: ${totalProcessado} palavras.`);
                resolve(true);
            });

            pipeline.on('error', (err) => {
                console.error('Erro no parser/streaming:', err);
                reject(err);
            });
        }).on('error', (err) => {
            console.error('Erro na requisição HTTPS:', err);
            reject(err);
        });
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
