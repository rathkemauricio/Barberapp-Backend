import { prisma } from "../prisma";
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UserDTO } from "../DTO/UserDto";
import { UserValidator } from "../validators/UserValidator";

const validator = new UserValidator();

/**
 * Seleção padrão para dados do usuário
 * Exclui campos sensíveis como senha
 */
const userSelect = {
    id: true,
    name: true,
    email: true
};

/**
 * Cria um novo usuário/barbeiro no sistema
 * @param userData Dados do usuário a ser criado
 * @throws Error se o email já estiver em uso
 */
export async function createUser(userData: UserDTO): Promise<UserDTO> {
    validator.validateCreate(userData);

    const userExists = await prisma.user.findFirst({
        where: { email: userData.email }
    });

    if (userExists) throw new Error("Usuário já existe");

    const passwordHash = await hash(userData.password!, 8);
    return await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: passwordHash,
        },
        select: userSelect
    });
}

/**
 * Autentica um usuário no sistema
 * @param userData Dados de login (email e senha)
 * @returns Dados do usuário com token JWT
 * @throws Error se as credenciais forem inválidas
 */
export async function authenticateUser(userData: UserDTO): Promise<UserDTO> {
    validator.validateAuth(userData);

    const user = await prisma.user.findFirst({
        where: { email: userData.email }
    });
    if (!user) throw new Error("Usuário ou senha incorretos");

    const passwordMatch = await compare(userData.password!, user.password);
    if (!passwordMatch) throw new Error("Usuário ou senha incorretos");

    const token = sign(
        { name: user.name, email: user.email },
        process.env.JWT_SECRET as string,
        { subject: user.id, expiresIn: "30d" }
    );

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        token
    };
}

/**
 * Busca os detalhes de um usuário específico
 * @param userId ID do usuário a ser buscado
 * @throws Error se o usuário não for encontrado
 */
export async function getUserDetails(userId: string): Promise<UserDTO> {
    const user = await prisma.user.findFirst({
        where: { id: userId },
        select: userSelect
    });

    if (!user) throw new Error("Usuário não encontrado");
    return user;
} 